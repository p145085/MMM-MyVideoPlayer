Module.register("MMM-MyVideoPlayer", {
  // Module configuration options
  defaults: {
    webmFolder: "webms",
    gifFolder: "gifs",
    mp4Folder: "mp4s",
    serverUrl: "http://localhost:3001", // Adjust as needed
    playsBeforeChange: 2,
  },
  playsCounter: 0,
  currentVideo: null,

  start: function () {
    this.playRandomVideo();
    console.log("Running MyVideoPlayer");
  },

  getStyles: function () {
    return ["MMM-MyVideoPlayer.css"];
  },

  getDom: function () {
    // Create the initial wrapper element if not exists
    if (!this.wrapper) {
      this.wrapper = document.createElement("div");
      this.wrapper.className = "my-video-player"; // Add your custom class if needed
    }

    // Perform initial setup and create child elements if needed

    // Return the wrapper element
    return this.wrapper;
  },

  updateDom: function () {
console.log("Updating DOM");
    // Perform any updates to the module's DOM structure
    // This method is called whenever the module needs to be updated
    // Access and manipulate this.wrapper here
      this.playRandomVideo();
  },

  playRandomVideo: function () {
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.loop = false;

    // Determine whether to play a webm, gif, or mp4
    const randomValue = Math.random();
    let fileFolder, fileExtension;

    if (randomValue < 0.33) {
      fileFolder = this.config.webmFolder;
      fileExtension = "webm";
    } else if (randomValue < 0.66) {
      fileFolder = this.config.gifFolder;
      fileExtension = "gif";
    } else {
      fileFolder = this.config.mp4Folder;
      fileExtension = "mp4";
    }
   // Logic to retrieve and play a random video from the specified folder
    this.getAndPlayRandomFile(videoElement, fileFolder, fileExtension);
  },

  getAndPlayRandomFile: function (videoElement, folder, extension) {
    // Fetch the list of files from the server
    this.getListOfFiles(folder)
      .then((files) => {
        // If there are no files, log an error and exit
        if (files.length === 0) {
          console.error(`No ${extension.toUpperCase()} files found in ${folder}`);
          return;
        }

        // Select a random file from the list
        const randomFile = files[Math.floor(Math.random() * files.length)];

      console.log(`Playing next ${extension.toUpperCase()} file: ${randomFile}`);

        // Set the source of the video element to the selected file
        videoElement.src = `${this.config.serverUrl}/files/${folder}/${encodeURIComponent(randomFile)}`;

        // Check if this.wrapper is defined
        if (this.wrapper) {
          // Remove existing video elements
          while (this.wrapper.firstChild) {
            this.wrapper.removeChild(this.wrapper.firstChild);
          }

          // Append the video element to the module's DOM
          this.wrapper.appendChild(videoElement);

        videoElement.addEventListener("error", (error) => {
          console.error("Error loading video:", error);
          // Handle the error (e.g., skip to the next video)
          this.playRandomVideo();
        });

          // Listen for the video ended event to trigger the next video
          videoElement.addEventListener("ended", () => {
            this.playsCounter++;

            // Check if the playsCounter has reached the configured limit
            if (this.playsCounter >= this.config.playsBeforeChange) {
              // Reset the counter
              this.playsCounter = 0;

              // Play a new random video
              this.playRandomVideo();
            } else {
              // Continue playing the same video
              videoElement.play();
            }
          });
        } else {
          console.error(`Error loading ${extension.toUpperCase()} files: 'wrapper' element is undefined.`);
        }
      })
      .catch((error) => {
        console.error(`Error loading ${extension.toUpperCase()} files:`, error);
      });
  },

  getListOfFiles: function (folder) {
    return new Promise((resolve, reject) => {
      const apiUrl = `${this.config.serverUrl}/fileList/${folder}/`;

      // Fetch the list of files from the server
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file list for ${folder}`);
          }
          return response.json();
        })
        .then((files) => resolve(files))
        .catch((error) => reject(error));
    });
  },
});
