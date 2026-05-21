import fs from "fs";
import { google } from "googleapis";

// 🔐 Auth
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// 🔁 Prevent duplicates (for shortcuts)
const seen = new Set();

// 🔁 Recursive crawl
async function getFolder(folderId, currentPath = "") {
  let files = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "nextPageToken, files(id, name, mimeType, shortcutDetails)",
      pageToken,
    });

    files = files.concat(res.data.files);
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  const children = [];

  for (const file of files) {
    // 🔥 HANDLE SHORTCUT
    if (file.mimeType === "application/vnd.google-apps.shortcut") {
      const targetId = file.shortcutDetails?.targetId;
      const targetMime = file.shortcutDetails?.targetMimeType;

      if (!targetId) continue;

      // 📂 Shortcut → Folder
      if (targetMime === "application/vnd.google-apps.folder") {
        const newPath = currentPath
          ? `${currentPath} / ${file.name}`
          : file.name;

        children.push({
          name: file.name,
          type: "folder",
          children: await getFolder(targetId, newPath),
        });
      }

      // 📄 Shortcut → File
      else {
        if (seen.has(targetId)) continue;
        seen.add(targetId);

        const meta = await drive.files.get({
          fileId: targetId,
          fields: "name",
        });

        children.push({
          name: meta.data.name,
          type: "file",
          id: targetId,
          path: currentPath,
        });
      }

      continue;
    }

    // 📂 Normal folder
    if (file.mimeType === "application/vnd.google-apps.folder") {
      const newPath = currentPath
        ? `${currentPath} / ${file.name}`
        : file.name;

      children.push({
        name: file.name,
        type: "folder",
        children: await getFolder(file.id, newPath),
      });
    }

    // 📄 Normal file
    else {
      if (seen.has(file.id)) continue;
      seen.add(file.id);

      children.push({
        name: file.name,
        type: "file",
        id: file.id,
        path: currentPath,
      });
    }
  }

  // sort folders first
  children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return children;
}

// 🔥 FLATTEN FUNCTION (added)
function flattenTree(node, result = []) {
  if (node.type === "file") {
    result.push({
      name: node.name,
      id: node.id,
      path: node.path,
    });
  }

  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      flattenTree(child, result);
    }
  }

  return result;
}

// 🏁 Main
(async () => {
  try {
    const ROOT_FOLDER_ID = "1ms1X7bkoF1igt8xFa_dCqTri_9IX8RbR";

    const rootMeta = await drive.files.get({
      fileId: ROOT_FOLDER_ID,
      fields: "name",
    });

    const rootName = rootMeta.data.name;

    const rootChildren = await getFolder(ROOT_FOLDER_ID, rootName);

    // 🔥 Find specific folders
    const english = rootChildren.find(f =>
      f.name.toLowerCase().includes("english")
    );

    const physics = rootChildren.find(f =>
      f.name.toLowerCase().includes("physics")
    );
    const chemistry = rootChildren.find(f =>
      f.name.toLowerCase().includes("chemistry")
    );

    const maths = rootChildren.find(f =>
      f.name.toLowerCase().includes("maths")
    );

    // 📝 Write tree files
    if (english) {
      fs.writeFileSync(
        "public/data/english.json",
        JSON.stringify(english, null, 2)
      );
      console.log("✅ english.json created");
    } else {
      console.log("⚠️ English folder not found");
    }

    if (physics) {
      fs.writeFileSync(
        "public/data/physics.json",
        JSON.stringify(physics, null, 2)
      );
      console.log("✅ physics.json created");
    } else {
      console.log("⚠️ Physics folder not found");
    }

    if (chemistry) {
      fs.writeFileSync(
        "public/data/chemistry.json",
        JSON.stringify(chemistry, null, 2)
      );
      console.log("✅ chemistry.json created");
    } else {
      console.log("⚠️ Chemistry folder not found");
    }

    if (maths) {
      fs.writeFileSync(
        "public/data/maths.json",
        JSON.stringify(maths, null, 2)
      );
      console.log("✅ maths.json created");
    } else {
      console.log("⚠️ Maths folder not found");
    }

    // 🔥 CREATE FLATTENED SEARCH INDEX (added)
    const flat = flattenTree({
      type: "folder",
      children: rootChildren,
    });

    fs.writeFileSync(
      "public/data/search-index.json",
      JSON.stringify(flat, null, 2)
    );

    console.log("✅ search-index.json created");

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();