import Irys from "@irys-network/bundler-client";

import { Uploader } from "@irys/upload";
import { Bera } from "@irys/upload-ethereum";
import "dotenv/config";
import { env } from "../components/utils/env";

const getIrysUploader = async () => {
  const irysUploader = await Uploader(Bera).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};

const fundIrys = async () => {
  const irysUploader = await getIrysUploader();
  try {
    const fundTx = await irysUploader.fund(irysUploader.utils.toAtomic(0.05));
    console.log(
      `Successfully funded ${irysUploader.utils.fromAtomic(fundTx.quantity)} ${
        irysUploader.token
      }`
    );
  } catch (e) {
    console.log("Error uploading data ", e);
  }
};

const uploadFile = async () => {
  const irysUploader = await getIrysUploader();
  // Your file
  const fileToUpload = "./images/image-1.png";

  const tags = [{ name: "application-id", value: "MyNFTDrop" }];

  try {
    const receipt = await irysUploader.uploadFile(fileToUpload, { tags: tags });
    console.log(
      `File uploaded ==> https://gateway.irys.xyz/${receipt.id}`
    );
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};

const uploadFolder = async () => {
  const irysUploader = await getIrysUploader();

  // Upload an entire folder
  const folderToUpload = "/images/"; // Path to folder
  try {
    const receipt = await irysUploader.uploadFolder("./" + folderToUpload, {
      indexFile: "", // Optional index file (file the user will load when accessing the manifest)
      batchSize: 50, // Number of items to upload at once
      keepDeleted: false, // whether to keep now deleted items from previous uploads
    }); // Returns the manifest ID

    console.log(`Files uploaded. Manifest ID ${receipt?.id}`);
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};

const uploadData = async () => {
  const irysUploader = await getIrysUploader();
  const dataToUpload = "hirys world.";
  try {
    const receipt = await irysUploader.upload(dataToUpload);
    console.log(
      `Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`
    );
  } catch (e) {
    console.log("Error uploading data ", e);
  }
};

const main = async (): Promise<void> => {
  const irysUploader = await getIrysUploader();
  console.log(`Connected to Irys from ${irysUploader.address}`);

  // await fundIrys();

  await uploadData();
  await uploadFile();
  await uploadFolder();
};

main();
