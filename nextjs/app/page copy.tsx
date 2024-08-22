"use client";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center py-16 text-white">
      <div className=" p-8 md:p-12 lg:p-16 text-left">
        <h1 className="text-4xl font-bold mb-1">Irys Testnet Example Repo</h1>
        <p className="text-lg mb-4">This repo has components that:</p>
        <ol className="list-inside list-decimal text-left text-lg space-y-1">
          <li>Fund / Withdraw tokens from the Irys Testnet</li>
          <li>Upload images to the Irys Testnet</li>
        </ol>
      </div>
    </main>
  );
};

export default Home;
