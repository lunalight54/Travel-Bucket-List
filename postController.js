const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://pawel:2002269Alex@cluster0.unqwm7c.mongodb.net/?retryWrites=true&w=majority";

exports.addPost = async function (req, res) {
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

    const { title, country, image, comment, userId } = req.body;

    //create new post and save the id
    const post = await database.collection('journey_posts').insertOne({image_url: image, title: title, country_name: country, comment: comment});
    post_id = new ObjectId(post.insertedId.toString());

    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { journey_posts: post_id} }
    );

    res.status(200).send('Post added successfully');
    } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).send('An error occurred');
    } finally {
        client.close();
    }
};