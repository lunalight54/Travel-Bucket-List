const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pawel:2002269Alex@cluster0.unqwm7c.mongodb.net/?retryWrites=true&w=majority";

module.exports = async function login(username, password) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('country_bucket_list');
    const collection = database.collection('users');

    const user = await collection.findOne({ username: username, password: password });

    if (user) {
      console.log('Login successful');
      if (user.countries && user.countries.length > 0) {
          console.log("There are countries!");

          const countryCollection = database.collection('countries');
            const countryIds = user.countries;

            const countries = await countryCollection.find({ _id: { $in: countryIds } }).toArray();

            const response = {
                id: user._id.toString(),
                countries: countries
            };
          return response;
      } else {
          console.log("No countries");
      }
      return { id: user._id.toString(), countries: [] }; // Return an empty array if no countries exist
    } else {
        console.log('Invalid credentials');
        return null;
    }
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
  } finally {
      await client.close();
  }
}