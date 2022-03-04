import { usePlugStore, useRecordsStore } from '@/store'
import { shortPrincipal } from '@/utils'
import { Avatar, Center, Circle, Flex, Image, Text } from '@chakra-ui/react'
import { DefaultInfoExt, ICNSResolverController } from 'icns-js'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

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

const Home: NextPage = () => {
  const { reverseName, principalId } = usePlugStore()
  const [loading, setLoading] = useState(true)
  const [infos, setInfos] = useState<null | DefaultInfoExt>(null)

  const {domainName, records} = useRecordsStore()

  const linkBars = useMemo(() => <>{
    records?.textExtensions?.map(
      ([title, link], index) =>
        <LinkBar key={index} title={title} link={link} />
    )
  }</>, [records])

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
        <Image bgColor='white'
          boxSize='80px'
          boxShadow='0 0 10px rgba(0, 0, 0, 0.1)'
          borderRadius='12px'
          marginBottom='16px'
          src='/Rectangle.jpg'
        />
        <Text marginBottom='4px'
          textColor='regular.light'
          fontWeight='bold'
          fontSize='16px'>
          {domainName}.icp
        </Text>
        <Text fontSize='14px'
          fontWeight='semibold'>
          {infos?.description?.[0] ?? 'Description not set'}
        </Text>
      </Flex>
      {linkBars}
      <LinkBar key={2} title='title' link='linklinklnk' />
      <Flex width='100%'
        margin='24px auto'
        justifyContent='center'>
        <a hidden={!infos?.twitter || infos?.twitter.length < 1}
          href={infos?.twitter[0]}>
          <Image src='/twitter.svg' margin='0 8px' cursor='pointer' />
        </a>
        {/* <a hidden={!infos? || infos?.twitter.length<1} 
          href={infos?.twitter[0]}></a>
        <Image src='/ins.svg' margin='0 8px' cursor='pointer' /> */}
        {/* <Image src='/linkedin.svg' margin='0 8px' cursor='pointer' /> */}
        <a hidden={!infos?.telegram || infos?.telegram.length < 1}
          href={infos?.telegram[0]}>
          <Image src='/telegram.svg' margin='0 8px' cursor='pointer' />
        </a>
        <a hidden={!infos?.email || infos?.email.length < 1}
          href={infos?.email[0]}>
          <Image src='/mail.svg' margin='0 8px' cursor='pointer' />
        </a>
        <Image src='/plus.svg' margin='0 8px' cursor='pointer' />
      </Flex>
    </Flex>
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
  )
}

export default Home
