import "dotenv/config";
import axios from "axios";

const apiKey = process.env.API_KEY;
const sheetUrl = process.env.SHEET_URL;
const maxResults = 50;
const minSubscribers = 50000;
const maxSubscribers = 250000;

async function fetchChannels() {
  let channelIds = new Set();
  let nextPageToken = "";
  const region = "US";
  const relevanceLanguage = "en";

  do {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&videoCategoryId=27&maxResults=${maxResults}&regionCode=${region}&relevanceLanguage=${relevanceLanguage}&pageToken=${nextPageToken}`;
    const searchResponse = await axios.get(searchUrl);
    const searchData = searchResponse.data;

    searchData.items.forEach((item) => {
      channelIds.add(item.snippet.channelId);
    });

    nextPageToken = searchData.nextPageToken;
  } while (nextPageToken);

  const channelIdArray = Array.from(channelIds);
  const filteredChannels = [];

  for (let i = 0; i < channelIdArray.length; i += 50) {
    const chunk = channelIdArray.slice(i, i + 50);
    const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=snippet,statistics&id=${chunk.join(
      ","
    )}`;
    const channelDetailsResponse = await axios.get(channelDetailsUrl);
    const channelData = channelDetailsResponse.data;

    channelData.items.forEach((channel) => {
      const subscribers = parseInt(channel.statistics.subscriberCount, 10);
      if (subscribers >= minSubscribers && subscribers <= maxSubscribers) {
        const formattedChannel = {
          title: channel.snippet.title,
          customUrl: `https://youtube/${channel.snippet.customUrl}`,
          country: channel.snippet.country,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount,
        };
        filteredChannels.push(formattedChannel);
      }
    });
  }

  return filteredChannels;
}

async function postChannels(channels) {
  try {
    await axios.post(
      sheetUrl,
      {
        json: JSON.stringify(channels),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Filtered Channels posted successfully.");
  } catch (error) {
    console.error("Error posting channels:", error);
    throw error;
  }
}

(async function main() {
  let totalLeads = 0;
  const startTime = Date.now();

  while (true) {
    try {
      const channels = await fetchChannels();
      await postChannels(channels);
      totalLeads += channels.length;
    } catch (error) {
      console.error("An error occurred, stopping the loop:", error);
      break;
    }
  }

  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;

  console.log(`Total leads generated: ${totalLeads}`);
  console.log(`Time taken: ${timeTaken} seconds`);
})();
