import { Router, useRouter } from "next/router"
import Link from "next/link"
import { shortPrincipal } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react"
import { usePlugInit } from '@/integrations/plug';
import { Box, Button, Drawer, DrawerBody, Spinner, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Img, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useToast } from "@chakra-ui/react";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ConnectButton } from "../connect";
import { useRecordsInit } from "@/integrations/records";


export const Header = () => {

  useRecordsInit()
  
  const route = useRouter()
  const btnRef: any = useRef()
  const [editing, setEditing] = useState(false)
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
        <Button width='100px'
          height='36px'
          borderRadius='18px'
          border='solid 1px #3366FF'
          color='regular.light'
          marginRight='16px'
          bgColor='white'
          onClick={()=>{
            router.push(editing ? '/' : '/edit/profile')
            setEditing(!editing)
            
          }}> {editing ? 'Close edit': 'Edit'} </Button>
        <ConnectButton />
      </Flex>
    </Flex>
  )
}