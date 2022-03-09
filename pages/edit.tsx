import { useResolverController } from "@/hooks"
import { recordsActions, useAppDispatch, useRecordsStore } from "@/store"
import { socialKeys } from "@/utils"
import { Flex, Image, Text, Box, Input, Textarea, Tabs, Tab, TabPanels, TabPanel, TabList, Grid, Button, useOutsideClick, Skeleton, useToast } from "@chakra-ui/react"
import { NextPage } from "next"
import { useRef, useState } from "react"

const SocialLinksField = ({ title, value }: { title: string, value?: string }) => {
  const [editing, setEditing] = useState(false)
  const { domainName, records } = useRecordsStore()
  const [input, setInput] = useState(value??'')
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const ref = useRef()

  const dispatch = useAppDispatch()
  const resolverController = useResolverController()


  useOutsideClick({
    ref: ref as any,
    handler: () => setEditing(false)
  })

  const handleSave = () => {
    const newValue = input
    if (resolverController) {
      setLoading(true)
      resolverController.setText(domainName + '.icp', title, newValue).then(() => {
        dispatch(recordsActions.setRecords({ [title]: newValue }))
        toast({
          title: 'Success!',
          status: 'success',
          description: 'Set link successfully',
          duration: 5000,
          isClosable: true,
        })
        setEditing(false)
      }).catch((error) => {
        toast({
          title: 'Failed',
          status: 'error',
          description: 'Fail to set link: ' + error,
          duration: 5000,
          isClosable: true,
        })
      }).finally(()=>{
        setLoading(false)
      })
    }
  }

  return <Box width='100%' margin='8px 0' ref={ref as any}>
    <Flex alignItems='center'
      justifyContent='space-between'>
      <Text fontWeight='bold'>
        {title[0].toUpperCase() + title.slice(1)}
      </Text>
      <Skeleton flexGrow='1' maxWidth='500px' isLoaded={!loading} >
        <Input maxWidth='500px'
          // defaultValue={ "Not set"}
          value={input}
          placeholder={'Put your '+ title +' link here'}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          onFocus={() => {
            setEditing(true)
          }} />
      </Skeleton>
    </Flex>
    <Flex
      width='100%'
      hidden={!editing}
      justifyContent='flex-end'
      margin='15px 0'>
      <Button colorScheme='regular'
        isLoading={loading}
        disabled={loading}
        marginRight='8px'
        variant='outline' onClick={() => { setEditing(false) }}>Cancel</Button>
      <Button colorScheme='regular'
        variant='solid'
        isLoading={loading}
        disabled={loading}
        onClick={() => {
          handleSave()
        }} >Save</Button>
    </Flex>
  </Box>
}

export const Edit: NextPage = () => {

  const { domainName, records } = useRecordsStore()
  const [avatarLink, setAvatarLink] = useState(records?.avatar?.[0] ?? '')
  const [description, setDescription] = useState(records?.description?.[0] ?? '')

  return <>
    <Flex paddingTop='10vh'
      maxWidth='635px'
      flexDirection='column'
      alignItems='center'
      minHeight='90vh'
      margin='0 auto'>
      <Tabs alignItems='center' variant='soft-rounded' width='100%'>
        <TabList width='173px'
          padding='4px'
          rounded='20px'
          backgroundColor='#ECF1FF'
          justifyContent='space-between'
          margin='0 auto'>
          <Tab width='100%' _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>Profile</Tab>
          <Tab width='100%' _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>Links</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex width='100%'
              flexDirection='column'
              alignItems='center'
              margin='32px 0'>
              <Image bgColor='white'
                boxSize='80px'
                boxShadow='0 0 10px rgba(0, 0, 0, 0.1)'
                borderRadius='12px'
                marginBottom='16px'
                src={avatarLink ? avatarLink : '/Rectangle.jpg'}
                fallbackSrc='/Rectangle.jpg'
              />
              <Text marginBottom='4px'
                textColor='regular.light'
                fontWeight='bold'
                fontSize='16px'>
                {domainName}.icp
              </Text>
              <Text fontSize='14px'
                fontWeight='semibold'>
                {records?.description && (records?.description?.[0] ?? 'Description not set')}
              </Text>

              <Box maxWidth='600px'
                margin='20px 0'
                width='100%'>
                <Text fontWeight='bold' fontSize='14px'>
                  Avatar Link
                </Text>
                <Input width='100%'
                  marginTop='4px'
                  value={avatarLink}
                  placeholder='Put a image link here'
                  onChange={(e) => {
                    var text = e.target.value
                    // if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(text))
                    setAvatarLink(text)
                  }} />
              </Box>
              <Box maxWidth='600px'
                marginBottom='20px'
                width='100%'>
                <Text fontWeight='bold' fontSize='14px'>
                  Description
                </Text>
                <Textarea width='100%'
                  margin='4px 0'
                  value={description}
                  placeholder={'Put your description here'}
                  onChange={(e) => {
                    var text = e.target.value
                    setDescription(text)
                  }} />
                <Text color='grey.b3'> {description.length} / 500 </Text>
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex width='100%'
              flexDirection='column'
              alignItems='center'
              margin='32px 0'>
              <Text fontSize='18px'
                marginBottom='32px'
                fontWeight='bold'>
                Customized Links
              </Text>
              <Grid gridTemplateColumns='236px 320px'
                border='solid 1px #E6E6E6'
                borderRadius='12px'
                padding='16px'
                gridColumnGap='16px'
                gridRowGap='12px'  >
                <Text fontSize='16px' fontWeight='semibold'>Title</Text>
                <Text fontSize='16px' fontWeight='semibold'>Url</Text>
                <Input />
                <Input />
                <Text color='grey.b3' >Caption</Text>
              </Grid>
              <Grid gridTemplateColumns='236px 320px'
                marginTop='16px'
                border='solid 1px #E6E6E6'
                borderRadius='12px'
                padding='16px'
                gridColumnGap='16px'
                gridRowGap='12px'  >
                <Text fontSize='16px' fontWeight='semibold'>Title</Text>
                <Text fontSize='16px' fontWeight='semibold'>Url</Text>
                <Input />
                <Input />
                <Text color='grey.b3' >Caption</Text>
              </Grid>
            </Flex>
            <Flex width='100%'
              flexDirection='column'
              alignItems='center'
              margin='32px 0'>
              <Text fontSize='18px'
                marginBottom='32px'
                fontWeight='bold'>
                Social Media Icons
              </Text>
              <Flex width='100%'
                margin='24px auto'
                justifyContent='center'>
                {
                  socialKeys.map((item, index) =>
                    <a key={index}
                      hidden={!(records as any)?.[item.key] || (records as any)?.[item.key].length < 1 } 
                      href={(records as any)?.[item.key][0]}>
                      <Image src={item.icon} boxSize='32px' margin='0 8px' cursor='pointer' alt={item.key}/>
                    </a>
                  )
                }
              </Flex>
              {
                socialKeys.map((item, index) =>
                  <SocialLinksField key={index} title={item.key} value={(records as any)?.[item.key][0]}/>
                )
              }

            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
}

export default Edit;