import React, { useState, useEffect } from 'react';
import axios from 'axios';
import parse, { domToReact } from 'html-react-parser';
import './RssFeed.css';



function RssFeed() {
    const [data, setData] = useState([]);

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // const proxyUrl = 'https://robwu.nl/dump.php';

    const rssUrl = `${proxyUrl}https://jidelna.fnol.cz/WebKredit/Api/Ordering/Rss?canteenId=1&locale=cs`;

    const removeH2Tags = (node) => {
        // Odstraní <h2> elementy
        if (node.type === 'tag' && node.name === 'h2') {
            return false;
        }
    };

    const removeWord = (htmlString) => {
        const wordToRemove = "<h2>Oběd</h2>";
        return htmlString.replace(new RegExp(wordToRemove, 'g'), '');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(rssUrl);
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const items = xmlDoc.getElementsByTagName("item");
                const parsedData = Array.from(items).map(item => {
                    return {
                        title: item.getElementsByTagName("title")[0].textContent,
                        description: item.getElementsByTagName("description")[0].textContent
                    };
                });

                setData(parsedData);
            } catch (error) {
                console.error('Error fetching or parsing data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Jídelníček</h1>
            {(data.length > 0) &&
                <div>
                    <h2>{data[0].title}</h2>
                    <div>{parse(removeWord(data[0].description))}</div>
                                    </div>
            }

        </div>
    );
}

export default RssFeed;
