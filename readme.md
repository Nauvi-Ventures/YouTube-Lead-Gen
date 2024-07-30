# YouTube Lead Generator

## Overview

This script retrieves YouTube channel data based on specific criteria and posts the filtered channel information to a specified endpoint. It uses the YouTube Data API to search for videos, collects unique channel IDs, retrieves detailed channel statistics, filters channels by subscriber count, and finally saves the data to a google sheet.

## Requirements

- **Node.js**: Ensure Node.js is installed on your machine.
- **Environment Variables**: The script requires `API_KEY` and `SHEET_URL` to be set in your environment.

## Installation

1. **Install Dependencies**:

   ```bash
   npm i
   ```

2. **Setup Environment Variables**:
   - Create a `.env` file in the root directory of your project.
   - Add the following lines, replacing with your actual values:
     ```
     API_KEY=your_youtube_data_api_key
     SHEET_URL=your_sheetdb_endpoint
     ```

## Script Explanation

### Imports

- `dotenv/config`: Loads environment variables from the `.env` file.
- `axios`: HTTP client for making requests.

### Constants

- `apiKey`: Your YouTube Data API key.
- `sheetUrl`: URL to post the filtered channel data.
- `maxResults`: Maximum number of results per page
- `minSubscribers`: Minimum subscriber count to filter channels (set to 50,000).
- `maxSubscribers`: Maximum subscriber count to filter channels (set to 250,000).

### Functions

#### `fetchChannels()`

- **Purpose**: Fetches YouTube channels based on the search criteria and filters them by subscriber count.
- **Process**:
  1. **Initialize**:
     - Create an empty `Set` for storing unique channel IDs.
     - Initialize pagination variables.
  2. **Fetch Video Data**:
     - Use the YouTube Data API to search for videos in the category of "Entertainment" (`videoCategoryId=27`).
     - Collect unique channel IDs from search results.
     - Continue fetching next pages until no more tokens are available.
  3. **Fetch Channel Details**:
     - Retrieve detailed information for channels in chunks of 50 IDs.
     - Filter channels based on the specified subscriber count range.
     - Format and collect channel information.
- **Returns**: Array of filtered and formatted channel objects.

#### `postChannels(channels)`

- **Purpose**: Posts the filtered channel data to the specified endpoint.
- **Process**:
  - Send a POST request with the channel data as a JSON payload.
  - Log success or error messages based on the result of the request.

### Execution

- **Entry Point**: The script runs `fetchChannels()` followed by `postChannels(channels)`.
- **Error Handling**:
  - Logs errors for fetching or posting data.

## Example Usage

Run the script using Node.js:

```bash
node index.js
```

## Troubleshooting

- **Missing Environment Variables**: Ensure `API_KEY` and `SHEET_URL` are set correctly in your `.env` file.
- **API Errors**: Verify your API key and check the YouTube Data API documentation for any quota or usage issues.
