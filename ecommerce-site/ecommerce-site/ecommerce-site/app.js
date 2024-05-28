const express = require("express");
const path = require("path");
const body_parser = require("body-parser")
const mongoose = require("mongoose");
const { log } = require("console");
const PORT = 3000 || process.env.PORT
app = express();

app.use(body_parser.json())



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const mySchema = new mongoose.Schema({
    ItemNo:String,
    name: String,
    price: String,
    qty: String,
    size: String,
    img: String
});

const MyModel = mongoose.model('FreakX', mySchema);


// await Kitten.save();

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
})
async function getItems() {

    const Items = await MyModel.find({});
    return Items;

}
app.get("/cart", (req, res) => {
    // let productData = MyModel.find({name: "Ayush"}, (err, docs)=>{// 

    res.sendFile(__dirname + "/public/cart.html");
})
app.get("/fetch-data", (req, res) => {
    getItems().then(function (FoundItems) {
        res.json(FoundItems)
    });
})
app.post("/remove-data",async (req, res)=>{
    await MyModel.deleteOne({"ItemNo": req.body.ItemNo})
})
app.get("/contact", (req, res) => {
    res.sendFile(__dirname + "/public/contact.html");
})
app.get("/product-details-1", (req, res) => {
    res.sendFile(__dirname + "/public/product-details-1.html");
})
app.get("/product-details-2", (req, res) => {
    res.sendFile(__dirname + "/public/product-details-2.html");
})
app.get("/product-details-3", (req, res) => {
    res.sendFile(__dirname + "/public/product-details-3.html");
})
app.get("/products-list", (req, res) => {
    res.sendFile(__dirname + "/public/products.html");
})

app.post("/cart-data", async (req, res) => {
    try {
        const cartItem = await MyModel.find({ "name": req.body.name, "size":req.body.size });
        if (cartItem.length != 0) {
            await MyModel.updateOne({"name": req.body.name},{$set:{"qty":(parseInt(cartItem[0].qty)+parseInt(req.body.qty)).toString()}})
        }
        else {
            const newData = new MyModel({
                ItemNo: req.body.ItemNo,
                name: req.body.name,
                price: req.body.price,
                qty: req.body.qty,
                size: req.body.size,
                img: req.body.img
            })
            await newData.save()
            console.log("data saved")
            res.status(200).send("Data saved successfully")
        }
    } catch (err) {
        res.status(500).send("Something went wrong")
        throw err
    }
})
app.listen(PORT, () => {
    console.log("App is listening on port: http://localhost:" + PORT);
})