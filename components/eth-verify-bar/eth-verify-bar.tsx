import { shortPrincipal } from "@/utils"
import { Flex, FlexProps, Spinner } from "@chakra-ui/react"
import { IoCheckmarkCircleSharp } from "react-icons/io5"
import { MdNotInterested } from "react-icons/md"

export const ETHVerifyBar = ({
  loading=false,
  address="",
  ...props
}: {
  loading?: boolean,
  address: string,
} & FlexProps ) => {
  return <Flex width='fit-content'
    alignItems='center'
    padding='8px 16px 8px 8px'
    borderRadius='20px'
    gap='4px'
    color="#666666"
    border='1px solid #E6E6E6'
    {...props}>
    {loading && <Spinner />}
    {!loading && (address ?
      <>
        <IoCheckmarkCircleSharp size='24px' color="#3366FF" />
        Verified!&nbsp;&nbsp;
        {shortPrincipal("0x" + address)}
      </> : <>
        <MdNotInterested size='24px' color="#E6E6E6" />
        Not Verified
      </>)}
  </Flex>
}