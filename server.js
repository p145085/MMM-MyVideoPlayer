// Keep this file in MagicMirror root directory.
  
const cors = require("cors");
const app = express();

app.use(cors());

// Define a route to serve the actual files
app.use("/files", express.static(__dirname + "/modules/MMM-MyVideoPlayer/public"));

// Define the file list route
app.get("/fileList/:folder", (req, res) => {
  const folder = req.params.folder;
  const allowedFolders = ["webms", "gifs", "mp4s"];

  // Check if the requested folder is allowed
  if (!allowedFolders.includes(folder)) {
    res.status(404).json({ error: "Invalid folder" });
    return;
  }

  const fs = require("fs");
  const path = `./modules/MMM-MyVideoPlayer/public/${folder}`;

  // Ensure the folder exists
  if (!fs.existsSync(path)) {
    res.status(404).json({ error: "Folder not found" });
    return;
  }

  const fileList = fs.readdirSync(path);

  res.json(fileList);
});

const port = 3001; // Adjust as needed
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
