import { useResolverController } from "@/hooks"
import { recordsActions, useAppDispatch, usePlugStore, useRecordsStore } from "@/store"
import { socialKeys } from "@/utils"
import { Flex, Image, Text, Box, Input, Textarea, Tabs, Tab, TabPanels, TabPanel, TabList, Grid, Button, useOutsideClick, Skeleton, useToast, Icon } from "@chakra-ui/react"
import { NextPage } from "next"
import { IoTrashSharp } from 'react-icons/io5'
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"

const CustomLinksField = ({ index = -1, asNew = false }: { index?: number, asNew?: boolean }) => {

  const toast = useToast()
  const ref = useRef()

  const dispatch = useAppDispatch()
  const resolverController = useResolverController()
  const { domainName, records } = useRecordsStore()

  const [editing, setEditing] = useState(false)
  useOutsideClick({
    ref: ref as any,
    handler: () => setEditing(false)
  })
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(records?.textExtensions?.[index]?.[0] ?? '')
  const [url, setUrl] = useState(records?.textExtensions?.[index]?.[1] ?? '')

  const [valid, setValid] = useState(true)

  useEffect(() => {
    if (asNew) {
      setTitle('')
      setUrl('')
    }
    else {
      setTitle(records?.textExtensions?.[index]?.[0] ?? '')
      setUrl(records?.textExtensions?.[index]?.[1] ?? '')
    }
  }, [records])

  useEffect(() => {
    if (url) {
      let tmp;
      try {
        tmp = new URL(url);
        setValid(true);
      } catch (_) {
        setValid(false);
      }
    } else {
      setValid(true);
    }
  }, [url])

  const handleDelete = () => {
    setLoading(true)
    // using title as usingTitle
    resolverController.setText(domainName + '.icp', title, '').
      then(() => {
        let extension = [...records.textExtensions]
        // console.log(title)
        // console.log(extension.filter((value) => value[0] !== title))
        dispatch(recordsActions.setRecords({ textExtensions: extension.filter((value) => value[0] !== title) }))
        toast({
          title: 'Success!',
          status: 'success',
          description: 'Delete link successfully',
          duration: 5000,
          isClosable: true,
        })
        setEditing(false)
      }).catch((error) => {
        toast({
          title: 'Failed',
          status: 'error',
          description: 'Fail to delete link: ' + error,
          duration: 5000,
          isClosable: true,
        })
      }).finally(() => {
        setLoading(false)
      })
  }

  const handleSave = () => {
    setLoading(true)
    let usingTitle = asNew ? '#link#' + title : title
    resolverController.setText(domainName + '.icp', usingTitle, url).then(() => {
      if (asNew) // no index
        dispatch(recordsActions.setRecords({ 'textExtensions': [...records.textExtensions, [usingTitle, url]] })) // new field
      else { // with index
        let extension = [...records.textExtensions].slice()
        extension[index] = [title, url] // set this
        dispatch(recordsActions.setRecords({ 'textExtensions': extension }))
        // console.log('finished')
      }
      toast({
        title: 'Success!',
        status: 'success',
        description: 'Set link successfully',
        duration: 5000,
        isClosable: true,
      })
      setEditing(false)
      // console.log(records)
    }).catch((error) => {
      toast({
        title: 'Failed',
        status: 'error',
        description: 'Fail to set link: ' + error,
        duration: 5000,
        isClosable: true,
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  return <Box ref={ref as any}
    margin='8px 0'
    onFocusCapture={() => {
      setEditing(true)
    }}>
    <Grid gridTemplateColumns='230px 370px'
      gridColumnGap='16px'>
      <Input
        disabled={!asNew || loading}
        bgColor='regular.100'
        fontWeight='medium'
        color='regular.500'
        value={asNew ? title : title.split('#link#')?.[1]}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
      />
      <Input
        value={url}
        isInvalid={!valid}
        disabled={loading}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
      />
    </Grid>
    <Flex
      width='100%'
      hidden={!editing}
      justifyContent='space-between'
      alignItems='center'
      margin='8px 0'>
      <Icon as={IoTrashSharp}
        boxSize="24px"
        color="grey.300"
        cursor='pointer'
        onClick={() => {
          if (!asNew && !loading)
            handleDelete()
        }} />
      <Box>
        <Button colorScheme='regular'
          isLoading={loading}
          disabled={loading}
          marginRight='8px'
          variant='outline'
          onClick={() => {
            setUrl(records?.textExtensions?.[index]?.[1] ?? '')
            setEditing(false)
          }}>Cancel</Button>
        <Button colorScheme='regular'
          variant='solid'
          isLoading={loading}
          disabled={loading || !valid}
          onClick={() => {
            handleSave()
          }} >Save</Button>
      </Box>
    </Flex>
  </Box>
}

const SocialLinksField = ({ title, value }:
  { title: string, value?: string }) => {
  const [editing, setEditing] = useState(false)
  const { domainName, records } = useRecordsStore()
  const [input, setInput] = useState(value ?? '')
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const ref = useRef()

  const dispatch = useAppDispatch()
  const resolverController = useResolverController()

  useOutsideClick({
    ref: ref as any,
    handler: () => setEditing(false)
  })

  useEffect(() => {
    setInput(value ?? '')
  }, [records])

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
      }).finally(() => {
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
          placeholder={'Put your ' + title + ' link here'}
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
      <Box>
        <Button colorScheme='regular'
          isLoading={loading}
          disabled={loading}
          marginRight='8px'
          variant='outline' onClick={() => { setEditing(false) }}>
          Cancel
        </Button>
        <Button colorScheme='regular'
          variant='solid'
          isLoading={loading}
          disabled={loading}
          onClick={() => {
            handleSave()
          }} >Save</Button>
      </Box>
    </Flex>
  </Box>
}

export const Edit: NextPage = () => {

  const { domainName, records, editor } = useRecordsStore()
  const { reverseName, principalId } = usePlugStore()
  const [avatarLink, setAvatarLink] = useState(records?.avatar?.[0] ?? '')
  const [description, setDescription] = useState(records?.description?.[0] ?? '')
  const [avatarAvail, setAvataAvail] = useState(false)
  const [editAvatar, setEditAvatar] = useState(false)
  const [editDesc, setEditDesc] = useState(false)
  const [loading, setLoading] = useState(true)

  const refAvatar = useRef()
  const refDesc = useRef()

  const resolverController = useResolverController()
  const dispatch = useAppDispatch()

  const toast = useToast()

  const router = useRouter()

  useOutsideClick({
    ref: refDesc as any,
    handler: () => setEditDesc(false)
  })

  useOutsideClick({
    ref: refAvatar as any,
    handler: () => setEditAvatar(false)
  })

  useEffect(() => {
    // if the content is not loaded, keep loading...
    if (!records) {
      setLoading(true)
    } else {
      setLoading(false)
    }

    // every time update content, reinit all fields
    setAvatarLink(records?.avatar?.[0]! ?? '')
    setDescription(records?.description?.[0]! ?? '')
  }, [records])

  const linkList = useMemo(() => {
    return <>
      {
        records?.textExtensions?.map((item, index) => {
          if (/^#link#/.test(item[0]))
            return <CustomLinksField key={index} index={index} />
        })
      }
      {
        records?.textExtensions?.length < 10 &&
        <CustomLinksField asNew={true} />
      }
    </>
  }, [records])

  const handleSaveAvatar = () => {
    setLoading(true)
    if (resolverController) {
      resolverController.setText(domainName, 'avatar', avatarLink).then(() => {
        dispatch(recordsActions.setRecords({ avatar: [avatarLink] }))
        toast({
          title: 'Success!',
          status: 'success',
          description: 'Update avatar link successfully',
          duration: 5000,
          isClosable: true,
        })
        setEditAvatar(false)
      }).catch((error) => {
        toast({
          title: 'Failed',
          status: 'error',
          description: 'Fail to update avatar link: ' + error,
          duration: 5000,
          isClosable: true,
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const handleSaveDesc = () => {
    setLoading(true)
    if (resolverController) {
      resolverController.setText(domainName, 'description', description).then(() => {
        dispatch(recordsActions.setRecords({ description: [description] }))
        toast({
          title: 'Success!',
          status: 'success',
          description: 'Set description successfully',
          duration: 5000,
          isClosable: true,
        })
        setEditAvatar(false)
      }).catch((error) => {
        toast({
          title: 'Failed',
          status: 'error',
          description: 'Fail to set description: ' + error,
          duration: 5000,
          isClosable: true,
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  return <>
    {
      !principalId || !editor.includes(principalId as string) ?
        <>
          <Flex paddingTop='10vh'
            maxWidth='635px'
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            minHeight='90vh'
            margin='0 auto'>

            <Skeleton isLoaded={!loading}>
              <Text fontSize='3xl'>
                {principalId ?
                  'Not Accessable!'
                  :
                  'Plug Not connected'}
              </Text>
              <br />
              <Button width='fit-content'
                float='right'
                colorScheme='regular'
                onClick={() => {
                  router.push('/')
                }}
              >
                Back
              </Button>
            </Skeleton>
          </Flex>
        </>
        :
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
                    src={avatarLink}
                    fit='cover'
                    fallbackSrc='/Rectangle.jpg'
                    onLoad={() => {
                      setLoading(false)
                      setAvataAvail(true)
                    }}
                    onError={() => {
                      setAvataAvail(false)
                    }}
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
                  <Box ref={refAvatar as any}
                    maxWidth='600px'
                    marginBottom='12px'
                    width='100%'>
                    <Box margin='20px 0 8px 0'>
                      <Text fontWeight='bold' fontSize='14px'>
                        Avatar Link
                      </Text>
                      <Input width='100%'
                        marginTop='4px'
                        value={avatarLink}
                        placeholder='Put a image link here'
                        onFocusCapture={() => {
                          setEditAvatar(true)
                        }}
                        onChange={(e) => {
                          var text = e.target.value
                          setLoading(true)
                          setAvataAvail(false)
                          // if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(text))
                          setAvatarLink(text)
                        }} />
                    </Box>
                    <Flex width='100%'
                      hidden={!editAvatar}
                      justifyContent='flex-end'>
                      <Button colorScheme='regular'
                        isLoading={loading}
                        disabled={loading}
                        marginRight='8px'
                        variant='outline'
                        onClick={() => {
                          setAvatarLink(records?.avatar?.[0]!)
                          setEditAvatar(false)
                        }}>Cancel</Button>
                      <Button colorScheme='regular'
                        variant='solid'
                        isLoading={loading}
                        disabled={loading || !avatarAvail}
                        onClick={() => {
                          handleSaveAvatar()
                        }} >Save</Button>
                    </Flex>
                  </Box>
                  <Box maxWidth='600px'
                    marginBottom='20px'
                    width='100%'>
                    <Text fontWeight='bold' fontSize='14px'>
                      Profile Title
                    </Text>
                    <Button width='fit-content'
                      marginTop='4px'
                      borderRadius='8px'
                      color='regular.500'
                      bgColor='regular.100' >
                      {domainName}.icp
                    </Button>
                  </Box>
                  <Box maxWidth='600px'
                    width='100%'
                    ref={refDesc as any}>
                    <Box marginBottom='8px'>
                      <Text fontWeight='bold' fontSize='14px'>
                        Description
                      </Text>
                      <Textarea width='100%'
                        margin='4px 0'
                        onFocusCapture={() => {
                          setEditDesc(true)
                        }}
                        value={description}
                        placeholder={'Put your description here'}
                        onChange={(e) => {
                          var text = e.target.value
                          setDescription(text)
                        }} />
                    </Box>
                    <Flex width='100%'
                      hidden={!editDesc}
                      justifyContent='space-between'>
                      <Text color='grey.300'> {description.length} / 500 </Text>
                      <Box>
                        <Button colorScheme='regular'
                          isLoading={loading}
                          disabled={loading}
                          marginRight='8px'
                          variant='outline'
                          onClick={() => {
                            setDescription(records?.description?.[0]!)
                            setEditDesc(false)
                          }}>Cancel</Button>
                        <Button colorScheme='regular'
                          variant='solid'
                          isLoading={loading}
                          disabled={loading}
                          onClick={() => {
                            handleSaveDesc()
                          }} >Save</Button>
                      </Box>
                    </Flex>
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
                    borderRadius='12px'
                    gridColumnGap='16px'>
                    <Text fontSize='16px' fontWeight='semibold'>Title</Text>
                    <Text fontSize='16px' fontWeight='semibold'>Url</Text>
                  </Grid>
                  {linkList}
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
                  </Flex>
                  {
                    socialKeys.map((item, index) =>
                      <SocialLinksField key={index} title={item.key} value={(records as any)?.[item.key][0]} />
                    )
                  }
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
    }
    <Image margin='0 auto' src='/icp-page.svg' />
  </>
}

export default Edit;