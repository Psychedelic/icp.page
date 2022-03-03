import { Router, useRouter } from "next/router"
import Link from "next/link"
import { shortPrincipal } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react"
import { usePlugInit } from '@/integrations/plug';
import { Box, Button, Drawer, DrawerBody, Spinner, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Img, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useToast } from "@chakra-ui/react";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ConnectButton } from "../connect";


export const Header = () => {
  const route = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef: any = useRef()

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
      <ConnectButton />
      </Flex>
    </Flex>
  )
  //style={{ backgroundColor: variables.primaryColor }}
}