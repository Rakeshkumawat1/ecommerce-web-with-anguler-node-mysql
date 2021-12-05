const { text } = require('body-parser');
const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL PRODUCTS */
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0 ) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0 ) ? req.query.limit : 10;

  let startValue;
  let endValue;

  if(page > 0){
    startValue = (page * limit ) -limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category',
              'p.title as name',
              'p.price',
              'p.description',
              'p.quantity',
              'p.image',
              'p.id'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if(prods.length > 0 ){
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      }else{
        res.json({message: 'No products founds'});
      }
    }).catch(err => console.log(err));



});

/* GET ALL  single PRODUCTS*/
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;
  console.log(productId);

  
  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category',
              'p.title as name',
              'p.price',
              'p.description',
              'p.quantity',
              'p.image',
              'p.images',
              'p.id'
    ])
    .filter({'p.id ' : productId})
    .get()
    .then(prod => {
      if(prod){
        res.status(200).json(prod);
      }else{
        res.json({message: ` No product founds with id ${productId} ` });
      }
    }).catch(err => console.log(err));


});

/* GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY */
router.get('/category/:catName', (req, res) => {

  let page = (req.query.page !== undefined && req.query.page !== 0 ) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0 ) ? req.query.limit : 10;

  let startValue;
  let endValue;

  if(page > 0){
    startValue = (page * limit ) -limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  // Fetch the category name from the url
  const cat_title = req.params.catName;

  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
      }])
      .withFields(['c.title as category',
              'p.title as name',
              'p.price',
              'p.description',
              'p.quantity',
              'p.image',
              'p.id'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if(prods.length > 0 ){
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      }else{
        res.json({message: `No products founds from  ${cat_title} category`});
      }
    }).catch(err => console.log(err));


});

/* DELETE SINGLE PRODUCTS */
router.delete("/delete/:prodId", (req, res) => {
  let prodId = req.params.prodId;

  if (!isNaN(prodId)) {
    database
      .table("products")
      .filter({ id: prodId })
      .remove()
        .then(successNum => {
            if (successNum == 1) {
                res.status(200).json({
                    message: `Record deleted with product id ${prodId}`,
                    status: 'success'
                });
            } else {
                res.status(500).json({status: 'failure', message: 'Cannot delete the product'});
          }
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res
      .status(500)
      .json({ message: "ID is not a valid number", status: "failure" });
  }
});


router.post('/addcategory/:catName', (req, res) => {
  let catName = req.params.catName;
  if(catName !== null){
    database.table('categories')
    .insert({
      title : catName
    }).then( newcategory => {
      res.json({
        message: `Category successfully added with category name ${catName}`,
        status: true
      });
    }).catch(err => console.log(err));

  }else{
    res.json({message:'new category failed to add' , status:false});
  }
});

router.post('/addproduct', async(req, res) =>{
  let {title , image, images, description, price, quantity, short_desc, cat_id } = req.body;
  if(title !== null && image !== null && description !== null 
    && price !== null && quantity !== null && short_desc !== null 
    && cat_id !== null && !isNaN(price) && !isNaN(quantity) && !isNaN(cat_id) && cat_id >0){
      database.table('products')
      .insert({
        title: title,
        image: image,
        images: images,
        description: description,
        price: price,
        quantity: quantity,
        short_desc: short_desc,
        cat_id: cat_id
      }).then(successNum =>{
        if(successNum ){
          res.status(200).json({
            message: 'Product Successfully added to the database',
            status: true
          });
        }else{
          res.status(500).json({
            message: 'Cannot add product',
            status: false
          });
        }
      }).catch((err) => res.status(500).json(err));
    }else{
      res
      .status(500)
      .json({ message: "Enter Currect data", status: false });
    }
})

router.get('/categoryvalidate/:category', async(req, res) =>{
  let category = req.params.category;
  console.log(category);
  let textCategory = await database.table('categories').filter({title: category}).get();
  if(textCategory){
    res.json({status: true});
  }else{
    res.json({status: false});
  }
})
module.exports = router;
