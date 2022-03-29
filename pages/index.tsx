import { usePlugStore, useRecordsStore } from '@/store'
import { socialKeys } from '@/utils'
import { Avatar, Center, Circle, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
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
  const { reverseName } = usePlugStore()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { domainName, records } = useRecordsStore()

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
          }
        )
      }</>
    }
  }, [records])

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
      {linkBars}
      <Flex width='100%'
        margin='24px auto'
        justifyContent='center'>
        {
          socialKeys.map((item, index) =>
            <a key={index}
              hidden={!(records as any)?.[item.key] || (records as any)?.[item.key].length < 1}
              href={item.key !== 'email' ?
                (records as any)?.[item.key][0]
                :
                'mailto:' + (records as any)?.[item.key][0]
              }>
              <Image src={item.icon} boxSize='32px' margin='0 8px' cursor='pointer' alt={item.key} />
            </a>
          )
        }
        {/* <Image hidden={domainName + '.icp' !== reverseName}
          src='/plus.svg'
          margin='0 8px'
          cursor='pointer'
          onClick={() => {
            router.push('/edit')
          }} /> */}
      </Flex>
    </Flex>
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
  )
}

export default Home
