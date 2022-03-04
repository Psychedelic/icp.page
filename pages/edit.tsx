import { useRecordsStore } from "@/store"
import { Flex, Image, Text, Box, Input, Textarea, Tabs, Tab, TabPanels, TabPanel, TabList, Grid } from "@chakra-ui/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"

export const Edit: NextPage = () => {
  const { domainName, records } = useRecordsStore()
  const [avatarLink, setAvatarLink] = useState('')
  const [description, setDescription] = useState('')

  return <>
    <Flex paddingTop='10vh'
      maxWidth='800px'
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
          <Tab _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>Profile</Tab>
          <Tab _focus={{ border: 'none' }} _selected={{ color: 'black', bg: 'white' }}>Links</Tab>
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
              />
              <Text marginBottom='4px'
                textColor='regular.light'
                fontWeight='bold'
                fontSize='16px'>
                {domainName}.icp
              </Text>
              <Text fontSize='14px'
                fontWeight='semibold'>
                {records?.description && (records?.description[0] ?? 'Description not set')}
              </Text>

              <Box maxWidth='500px'
                margin='20px 0'
                width='100%'>
                <Text fontSize='14px'>
                  Avatar Link
                </Text>
                <Input width='100%'
                  marginTop='4px'
                  value={avatarLink}
                  onChange={(e) => {
                    var text = e.target.value
                    setAvatarLink(text)
                  }} />
              </Box>
              <Box maxWidth='500px'
                marginBottom='20px'
                width='100%'>
                <Text fontSize='14px'>
                  Description
                </Text>
                <Textarea width='100%'
                  margin='4px 0'
                  value={description}
                  placeholder={records?.description?.[0] ?? 'Not set'}
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
                fontWeight='bold'>
                Customized Links
              </Text>
              <Grid>  </Grid>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
}

export default Edit;