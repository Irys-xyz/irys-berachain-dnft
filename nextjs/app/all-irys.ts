import Irys from "@irys-network/bundler-client";
import "dotenv/config";

const getIrys = async () => {
	const network = "testnet";
	// RPC URLs change often, use a recent one from https://chainlist.org/
	const providerUrl = "https://rpc2.sepolia.org";
	const token = "ethereum";

	const irys = new Irys({
		network,
		token, // Token used for payment
		key: process.env.PRIVATE_KEY, // ETH or SOL private key
		config: { providerUrl }, // RPC provider URL
	});
	return irys;
};

const fundIrys = async () => {
	const irys = await getIrys();
	try {
		const fundTx = await irys.fund(irys.utils.toAtomic(0.05));
		console.log(`Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`);
	} catch (e) {
		console.log("Error uploading data ", e);
	}
};

const uploadFile = async () => {
	const irys = await getIrys();
	// Your file
	const fileToUpload = "./images/image-1.png";

	const tags = [{ name: "application-id", value: "MyNFTDrop" }];

	try {
		const receipt = await irys.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://testnet-gateway.irys.xyz/${receipt.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};

const uploadFolder = async () => {
	const irys = await getIrys();

	// Upload an entire folder
	const folderToUpload = "/images/"; // Path to folder
	try {
		const receipt = await irys.uploadFolder("./" + folderToUpload, {
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
	const irys = await getIrys();
	const dataToUpload = "hirys world.";
	try {
		const receipt = await irys.upload(dataToUpload);
		console.log(`Data uploaded ==> https://testnet-gateway.irys.xyz/${receipt.id}`);
	} catch (e) {
		console.log("Error uploading data ", e);
	}
};

const main = async (): Promise<void> => {
  const irys = await getIrys();
  console.log(`Connected to Irys from ${irys.address}`);

  // await fundIrys();

  await uploadData();
  await uploadFile();
  await uploadFolder();
};

main();