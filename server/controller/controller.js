const model =require("../models/model")



//post:http://localhost:5000/api/categories
async function create_Categories(req,res){
    const Create = new model.Categories({
        type:"Investment",
        color:"#1F3B5C"//dark
    });
    try {
        const savedCreate =await Create.save();
        return res.json(savedCreate);
    } catch (err) {
        console.error('Save error:', err);
        return res.status(400).json({ message: `Error while creating categories: ${err.message}` });
    }

}

//get:http://localhost:5000/api/categories
async function get_Categories(req,res){
    let data=await model.Categories.find({})
    let filter=await data.map(v=>Object.assign({},{type:v.type,color:v.color}));
    return res.json(filter);
}



//  post: http://localhost:5000/api/transaction
async function create_Transaction(req, res){
    if(!req.body) return res.status(400).json("Post HTTP Data not Provided");
    let { name, type, amount } = req.body;
    const create =  new model.Transaction({
            name,
            type,
            amount,
            date: new Date()
        });


        try {
            const savedCreate =await create.save();
            return res.json(savedCreate);
        } catch (err) {
            console.error('Save error:', err);
            return res.status(400).json({ message: `Error while creating categories: ${err.message}` });
        }

    
    
}



//  get: http://localhost:5000/api/transaction
async function get_Transaction(req, res){
    let data = await model.Transaction.find({});
    return res.json(data);
}


// delete: http://localhost:5000/api/transaction/:id
async function delete_Transaction(req, res) {
    try {
        const { id } = req.params; // Extract ID from the URL parameters
        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        const result = await model.Transaction.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.status(200).json({ message: "Transaction deleted successfully", result });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
}




//  get: http://localhost:5000/api/labels
async function get_Labels(req, res){

    model.Transaction.aggregate([
        {
            $lookup : {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
        return res.json(data);
    }).catch(error => {
        res.status(400).json("Lookup Collection Error");
    })

}

module.exports={
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}