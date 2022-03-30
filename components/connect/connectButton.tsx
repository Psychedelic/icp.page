import { addIcpSuffix, shortPrincipal } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, usePlugStore, plugActions, FeatureState } from "@/store";
// import { ENV } from "@/config/env"
import { disconnect, requestConnect, usePlugInit } from '@/integrations/plug';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Switch, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { ICNSConstants } from "icns-js";

export const ConnectButton = () => {

  const { principalId, isConnected, state: plugState, reverseName } = usePlugStore();

  const dispatch = useAppDispatch();

  const handleConnect = (isConnected: boolean) => {
    dispatch(plugActions.setIsConnected(isConnected));
  };
  const { hasCopied, onCopy } = useClipboard(principalId!)
  const toast = useToast()

  const handleDisconnect = async () => {
    dispatch(plugActions.setIsConnected(false));
    dispatch(plugActions.setState(FeatureState.Disconnected))
    await disconnect()
  };

  usePlugInit()

  const isLoading = useMemo(() => {
    return plugState === FeatureState.Loading;
  }, [plugState]);

  const clickConnect = async () => {
    if (!Boolean(window.ic?.plug)) {
      // jump to plug install page
      window.open('https://plugwallet.ooo/', '_blank');
      return;
    }

    try {
      dispatch(plugActions.setState(FeatureState.Loading));

      const isConnected = await requestConnect({
        whitelist:
          [
            ICNSConstants.canisterIds.resolver,
            ICNSConstants.canisterIds.registry,
            ICNSConstants.canisterIds.reverse_registrar,
            ICNSConstants.canisterIds.registrar,
            ICNSConstants.canisterIds.favorite
          ],
        // Object.values(ICNSConstants.canisterIds),
        host: ICNSConstants.host,
      });

      if (isConnected) {
        handleConnect(isConnected);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(plugActions.setState(FeatureState.Idle));
    }
  }

  return <>{isConnected ?
    <Menu>
      <MenuButton
        colorScheme='regular'
        width={reverseName ? '160px' : '130px'}
        as={Button}
      // rightIcon={<GoTriangleDown />}
      >
        {reverseName ? (reverseName.length > 14 ?
          shortPrincipal(addIcpSuffix(reverseName! as string), 4, 8) : addIcpSuffix(reverseName! as string)) : shortPrincipal(principalId)}
      </MenuButton>
      <MenuList
        minWidth={reverseName ? '160px' : '130px'}
        borderRadius='20px'>
        <MenuItem onClick={() => {
          onCopy()
          toast({
            status: 'success',
            title: 'Copied Principal ID to your ClipBoard',
            duration: 3000,
          })
        }}>Copy Principal ID</MenuItem>
        <MenuItem onClick={() => {
          handleDisconnect()
        }
        }>Disconnect</MenuItem>
      </MenuList>
    </Menu>
    :
    <Button
      colorScheme='regular'
      width='130px'
      height='36px'
      borderRadius='18px'
      color='white'
      onClick={() => {
        clickConnect()
      }}>
      {isLoading ?
        "Loading" : "Connect"}
    </Button>
  }</>
}