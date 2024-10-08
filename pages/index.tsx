import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getDecentNftDetails, getNftDetails } from '../lib/getReleaseDetails';
import CountdownText from '../components/CountdownText';
import BoxModal from "../components/BoxModal";
import Box from '../components/Box';
import { ChainId } from '@decent.xyz/the-box';
import ConnectWallet from '../components/ConnectWallet';

const Home: NextPage = (props: any) => {
  const endDate = new Date(props.constants.sellOutDate * 1000);
  const [nftsMinted, setNftsMinted] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadMints() {
      if (props.constants.decentNft) {
        let contract = await getNftDetails(props.constants.chainId, props.constants.address);
        if (contract) setNftsMinted(contract.data.totalSupply?.toLocaleString() || "0");
      }
    }
    loadMints();
  }, [props.constants.address, props.constants.chainId, props.constants.decentNft]);

  return <>
    <Head>
      <title>{props.nftDetails.metadata.title}</title>
      <meta
        name="description"
        content={props.nftDetails.metadata.description}
      />
      <link rel="icon" href={props.nftDetails.metadata.image} />
      <meta property='og:type' content="website" />
      <meta property='og:url' content={"https://decent.xyz/"} />
      <meta property='og:image' content={props.nftDetails.metadata.image} />
      <meta property='og:title' content={props.nftDetails.metadata.title} />
      <meta property='og:description' content={props.nftDetails.metadata.description} />
      <meta name='twitter:card' content={"summary_large_image"} />
      <meta name='twitter:url' content={"https://decent.xyz/"} />
      <meta name='twitter:title' content={props.nftDetails.metadata.name} />
      <meta name='twitter:description' content={props.nftDetails.metadata.description} />
      <meta name='twitter:image' content={props.nftDetails.metadata.image} />
    </Head>

    <main>
      <BoxModal className="bg-white md:w-1/3 md:max-w-[500px] sm:w-2/3 w-full" isOpen={isOpen} setIsOpen={setIsOpen}>
        <Box constants={props.constants} />
      </BoxModal>
      <div className='w-full flex flex-wrap-reverse min-h-screen overflow-y-auto'>
        <div className='md:w-1/2 w-full bg-black text-white uppercase p-8'>
          <h1 className='text-[58px]'>squid squad star dance</h1>
          <p className='text-[28px] py-4'>by jay daniel wright</p>

          <h1 className='text-[58px]'>a cross-chain minting experience by</h1>

          <h1 className='text-[58px]'>{props.nftDetails?.metadata?.description}</h1>
        </div>

        <div className='md:w-1/2 w-full p-8'>
          <div className=' md:flex md:justify-center'>
            <div className='w-full flex justify-end'>
              <div className='w-fit'>
                <ConnectWallet />
              </div>
            </div>

            <div className='md:fixed space-y-6 pt-6'>
              <div className='flex justify-center md:mt-20'>
                <div className='space-y-3'>
                  <Image className="drop-shadow-lg rounded-lg" src={props.nftDetails?.metadata.image} height={500} width={500} alt={'nft'} />
                  <div className='flex justify-center'>
                    <div>
                      <button className='px-20 py-[7px] text-2xl text-white bg-black rounded-full' onClick={() => setIsOpen(true)}>Mint</button>
                    </div>
                  </div>
                  <div className='flex justify-center'>
                    <div className='flex gap-4 font-medium'>
                      <p className='text-right'>{props.constants.decentNft ? nftsMinted : props.nftDetails.data.totalSupply} | OPEN</p>
                      •
                      <p>ENDS:</p>
                      <CountdownText dropTime={endDate} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  </>
};

export default Home;

export async function getStaticProps() {
  let constants = {
    decentNft: false,
    address: '0xC749CC7e1Eee842534d841f1A356e50aA071D77D',
    chainId: ChainId.POLYGON,
    mintPrice: "0.0",
    sellOutDate: 4294967295
  }

  let nftDetails;
  if (constants.decentNft) {
    nftDetails = await getDecentNftDetails(constants.chainId, constants.address);
  } else {
    nftDetails = await getNftDetails(constants.chainId, constants.address);
  }

  return {
    props: {
      nftDetails,
      constants
    }
  };
};