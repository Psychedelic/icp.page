import { useETHVerifyController } from '@/hooks/use-eth-verify-controller'
import { usePlugStore, useRecordsStore } from '@/store'
import { shortPrincipal, socialKeys } from '@/utils'
import { Avatar, Center, Circle, Flex, Image, Skeleton, Text, Tabs, Tab, TabList, TabPanels, TabPanel, Icon, Spinner } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Network, Alchemy } from "alchemy-sdk";
import { SiOpensea } from "react-icons/si"
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { MdNotInterested } from 'react-icons/md'
import { ETHVerifyBar } from '@/components'

const LinkBar = ({ title, link, }: { title: string, link: string }) => {
  return (
    <Center width='90%'
      height='calc(20px + 3vh)'
      fontSize='16px'
      fontWeight='bold'
      marginBottom='24px'
      boxShadow='0 0 10px rgba(0, 0, 0, 0.1)'
      borderRadius='36px'
      _hover={{
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
      }}>
      <a href={link}>{title}</a>
    </Center>
  )
}

const NFTCard = ({ imageUrl }: { imageUrl: string }) => {
  const [contentType, setContentType] = useState<string>()
  useState((async () => {
    try {
      const reponse = await fetch(imageUrl, {
        method: 'HEAD',
      });
      const type = reponse.headers.get('Content-Type') ?? undefined
      console.log(type)
      setContentType(type)
    } catch (error) {
      console.error("Failed to load: " + imageUrl, error)
    }
  })())

  return contentType && !contentType.includes('image') ?
    <video controls autoPlay style={{
      width: "160px",
      height: "160px",
      borderRadius: "12px",
      backgroundColor: "black"
    }}>
      <source src={imageUrl} type={contentType} />
    </video> :
    <Image boxSize="160px" borderRadius="12px" src={imageUrl}
      fallback={<Skeleton boxSize="160px" borderRadius="12px" />} />
}

const Home: NextPage = () => {
  const { reverseName } = usePlugStore()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { domainName, records } = useRecordsStore()
  const controller = useETHVerifyController()

  const linkBars = useMemo(() => {
    if (typeof records == 'undefined') {
      setLoading(true)
    } else if (records.textExtensions.length <= 0) {
      setLoading(false)
      return <Text fontSize='2xl'> No links</Text>
    } else {
      setLoading(false)
      return <>{
        records?.textExtensions?.map(
          ([title, link], index) => {
            if (/^#link#/.test(title))
              return <LinkBar key={index}
                title={title.split('#link#')[1]}
                link={link} />
          })
      }</>
    }
  }, [records])

  // eth address for current page
  const [addr, setAddr] = useState('')

  const settings = {
    apiKey: process.env.ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);
  useEffect(() => {
    if (controller && domainName)
      controller.getETHAddr(domainName).then(res => {
        setAddr(res)
      })
  }, [domainName, controller])

  const [NFTCards, setNFTCards] = useState<Array<JSX.Element>>([])
  useEffect(() => {
    const cards: Array<JSX.Element> = []
    if (addr.length > 0) {
      // Print total NFT count returned in the response:
      alchemy.nft.getNftsForOwner("0x" + addr).then(nftsForOwner => {
        // Print contract address and tokenId for each NFT:
        for (const nft of nftsForOwner.ownedNfts) {
          if (nft.rawMetadata?.image)
            cards.push(<NFTCard imageUrl={nft.rawMetadata?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} />)
        }
        setNFTCards(cur => cards);
      }).catch((err) => {
        console.error(err)
      })
    }
  }, [addr])

  return (<>
    <Flex paddingTop='10vh'
      maxWidth='800px'
      flexDirection='column'
      alignItems='center'
      minHeight='90vh'
      margin='0 auto'>

      <Flex flexDirection='column'
        alignItems='center'
        marginBottom='48px'>
        <Skeleton isLoaded={!loading}>
          <Image bgColor='white'
            boxSize='80px'
            boxShadow='0 0 10px rgba(0, 0, 0, 0.1)'
            borderRadius='12px'
            marginBottom='16px'
            src={records?.avatar?.[0]}
            fallbackSrc='/Rectangle.jpg'
          />
        </Skeleton>
        <Skeleton isLoaded={!loading}>
          <Text marginBottom='4px'
            textColor='regular.light'
            fontWeight='bold'
            fontSize='16px'>
            {domainName}.icp
          </Text>
        </Skeleton>
        <Text fontSize='14px'
          fontWeight='semibold'>
          {records?.description?.[0] ?? 'Description not set'}
        </Text>
      </Flex>
      <Tabs alignItems='center' variant='soft-rounded' width='100%'>
        <TabList width='173px'
          padding='4px'
          rounded='20px'
          backgroundColor='#ECF1FF'
          justifyContent='space-between'
          margin='0 auto'>
          <Tab width='100%' _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>Links</Tab>
          <Tab width='100%' _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>NFTs</Tab>
        </TabList>
        <TabPanels>
          <TabPanel display='flex'
            flexDirection='column'
            alignItems='center'>
            {linkBars}
            <Flex width='100%'
              margin='24px auto'
              justifyContent='center'>
              {
                socialKeys.map((item, index) =>
                  <a key={index}
                    hidden={!(records as any)?.[item.key] || (records as any)?.[item.key].length < 1}
                    href={(records as any)?.[item.key][0]}>
                    <Image src={item.icon} boxSize='32px' margin='0 8px' cursor='pointer' alt={item.key} />
                  </a>
                )
              }
              <Image hidden={domainName + '.icp' !== reverseName}
                src='/plus.svg'
                margin='0 8px'
                cursor='pointer'
                onClick={() => {
                  router.push('/edit')
                }} />
            </Flex>
          </TabPanel>
          <TabPanel display='flex'
            flexDir="column"
            gap="20px"
            alignItems='center'>
            <ETHVerifyBar loading={loading} address={addr} />
            <Flex gap="20px"
              maxWidth='720px'
              height="400px"
              flexWrap="wrap"
              overflowY="auto"
              borderRadius="20px"
              width="100%"
              border="1px solid #E6E6E6"
              boxShadow="inset 0px -4px 6px rgba(0, 0, 0, 0.1)">
              {NFTCards.length > 0 ? NFTCards : 
              <Center width="100%"
                height="100%"
                color="#666666"
                flexDir='column'>
                <Text fontSize={48}>&#129753;</Text>
                <Text fontSize={16}>Ah! The bottle is empty..</Text>
              </Center>}
            </Flex>
            { addr && 
              <a href={"https://opensea.io/0x" + addr + "/collected"} 
                target="_blank" rel="noopener noreferrer">
                <Flex fontSize={14} alignItems='center'>
                  View on
                  <Icon margin="0 4px 0 8px"
                    color="#2081E2"
                    boxSize="24px"
                    as={SiOpensea} />
                  <Text fontWeight='semibold'>OpenSea</Text>
                </Flex>
              </a>
            }
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
  )
}

export default Home
