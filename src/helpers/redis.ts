// Retrieve the Upstash Redis REST URL from environment variables
const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
// Retrieve the Upstash Redis REST token from environment variables
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Define the valid Redis commands that can be executed
type Command = "zrange" | "sismember" | "smembers" | "get"

// Function to fetch data from Redis using a specified command and arguments
export async function fetchRedis(
    command: Command, // The Redis command to be executed
    ...args: (string | number)[] // Additional arguments for the command
) {
    // Construct the command URL by appending the command and its arguments
    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`;

    // Perform a fetch request to the constructed URL with the authorization header
    const response = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}` // Set the authorization token in the headers
        },
        cache: 'no-store', // Disable caching for this request
    })

    // Check if the response indicates a successful operation
    if (!response.ok) {
        return new Error(`Error executing Redis command: ${response.statusText}`); // Return an error if not ok
    }

    // Parse the response JSON to extract the data
    const data = await response.json();
    
    // Return the result from the Redis response
    return data.result;
}
