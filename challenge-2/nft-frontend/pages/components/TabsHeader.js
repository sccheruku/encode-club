import { useState } from "react";
import { Box, Tab, Button, Typography, Tabs, LinearProgress } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { buyNft } from "../utils/api-helper";
import { generateNftData } from "../utils/common";
import CircularProgress from '@mui/material/CircularProgress';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


export default function TabsHeader({ nfts, availableNfts, accountId }) {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [showSpinner, setShowSpinner] = useState(false)

    async function doBuyNft(nft) {
        setShowSpinner(true);
        const result = await buyNft({ ...nft, receiver_id: accountId });
        setShowSpinner(false);
        console.log("result", result);
        alert("Refresh your screen and find the NFT in your collection");
    }
    return (
        <Box sx={{ width: '100%' }}>
            {showSpinner && <LinearProgress />}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Browse NFTs" />
                    <Tab label="My Collection" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {
                    availableNfts &&
                    <TitlebarImageList items={availableNfts} icon={<LocalAtmIcon />} onIconClick={doBuyNft} showSpinner={showSpinner} />
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {nfts &&
                    <TitlebarImageList items={nfts} icon={<InfoIcon />} onIconClick={() => { }} />
                }
            </TabPanel>
        </Box>
    )
}

export function TitlebarImageList({ items, icon, onIconClick, showSpinner }) {
    return (
        <ImageList sx={{ width: "100%", height: "100%" }} cols={4}>
            {items.map((item) => (
                <ImageListItem key={item.img}>
                    <img
                        src={`${item.metadata.media}`}
                        alt={item.title}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={item.token_id}
                        subtitle={item.metadata.title}
                        actionIcon={
                            <IconButton
                                disabled={showSpinner}
                                onClick={() => onIconClick(item)}
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.metadata.title}`}
                            >
                                {icon}
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
