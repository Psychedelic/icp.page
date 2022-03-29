import { Router, useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePlugInit } from '@/integrations/plug';
import { Box, Button, Drawer, DrawerBody, Spinner, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Img, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useToast } from "@chakra-ui/react";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ConnectButton } from "../connect";
import { useRecordsInit } from "@/integrations/records";
import { usePlugStore, useRecordsStore } from "@/store";
import { Principal } from "@dfinity/principal";


export const Header = () => {

  useRecordsInit()
  const { reverseName, principalId } = usePlugStore()
  const { domainName, editor } = useRecordsStore()

  const [mobile, setMobile] = useState(false);

  function handleWindowSizeChange() {
    if (window.innerWidth <= 768) {
      setMobile(true)
    } else {
      setMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const router = useRouter()

  const editing = useMemo(() =>
    router && router.asPath.split('/')[1]?.includes('edit') ?
      true : false
    , [router.asPath])
  return (
    <Flex position='fixed' zIndex='99'
      height='50px'
      width='100%'
      bgColor='white'
      justifyContent='center'
    >
      <Flex width='90%'
        height='100%'
        alignItems='center'
        justifyContent='flex-end'
      >
        <Button
          variant='outline'
          hidden={ !principalId || !editor.includes(principalId as string)}
          colorScheme='regular'
          marginRight='16px'
          onClick={() => {
            router.push(editing ? '/' : '/edit')
          }}> {editing ? 'Close edit' : 'Edit'} </Button>
        <ConnectButton />
      </Flex>
    </Flex>
  )
}