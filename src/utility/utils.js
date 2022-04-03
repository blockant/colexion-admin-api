/**
 * Helper Methods To Deal with Changes
 */
function getNetworkFromChainId(chainId){
    if(chainId===1){
        return 'ETH'
    }else if(chainId>=2 && chainId<=5){
        return 'ETHT'
    }else if(chainId===56){
        return 'BSC'
    }else if(chainId===97){
        return 'BSCT'
    }else if(chainId===137){
        return 'POLY'
    }else if(chainId===80001){
        return 'POLYT'
    }
}
export default getNetworkFromChainId