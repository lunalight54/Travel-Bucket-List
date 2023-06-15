const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://pawel:2002269Alex@cluster0.unqwm7c.mongodb.net/?retryWrites=true&w=majority";

exports.addCountry = async function (req, res) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
    await client.connect();

    const database = client.db('country_bucket_list');
    const collection = database.collection('users');

    const { country, userId } = req.body;

    const SelectedCountry = await database.collection("countries").findOne( {name: country});
    countryId = new ObjectId(SelectedCountry._id.toString());//find country id

    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { countries: countryId} }
    );

    res.status(200).send('Country added successfully');
    } catch (error) {
    console.error('Error adding country:', error);
    res.status(500).send('An error occurred');
    } finally {
        client.close();
    }
};

exports.deleteCountry = async function (req, res) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
        });
    try {
    await client.connect();

    const database = client.db('country_bucket_list');
    const collection = database.collection('users');

    const { country, userId } = req.body;

    const SelectedCountry = await database.collection("countries").findOne( {name: country});
    countryId = new ObjectId(SelectedCountry._id.toString());

    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { countries: countryId } }
    );

    res.status(200).send('Country removed successfully');
    } catch (error) {
    console.error('Error removing country:', error);
    res.status(500).send('An error occurred');
    } finally {
    client.close();
    }
};

