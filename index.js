var express = require('express');

var app = express();
const PORT = process.env.PORT || 8080;

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

global.fetch = require('node-fetch');
const fs = require('fs');

var tweets = [
    "Can't resist it? Enjoy it bankers! So, HSBC and ING bank reliance Industries executed their first blockchain based finance transaction. A huge time cut for transactions from 7-10 days to under 24hrs.",
    "HSBC India and ING news Bank Brussels successfully executed a blockchain enabled, live trade finance transaction",
    "ETTelecom | HSBC, ING Bank execute blockchain transaction with Reliance Industries",
    "A lot of technologists see data as the bank’s possession. The open banking regime now gives customers real ownership over that data - Melanie Evans, ING (2nd from left) - Open Banking Panel",
    "World Bank, ING, & AXA Announce Fossil Fuel Divestment Worth Billions",
    "ING Bank is Making Blockchain a Priority ",
    "How can companies simplify their HR management systems? Here is how ING Bank used a cloud-based solution to achieve this.",
    "Consistently innovative & pragmatic, ING Bank is following a different path to rival banks testing of new cross-border payment rails: by investing €21m in Fintech TransferMate as immediate low-cost platform for international payments.",
    "Dutch bank ING is replacing 5,800 people with machines, at a cost of $2 billion ",
    "Please reconsider advertising with skynews with their blatantly bigoted content. I may reconsider my choice of bank if they support such views. Thank you ",
    ];

var txt  = "Dutch bank ING is replacing 5,800 people with machines, at a cost of $2 billion "

async function createModel()
{
    // const model = await tf.loadModel('file:///Users/ul14nw/Public/hackathonAIQ/model.json');
  const model = await tf.loadModel('https://raw.githubusercontent.com/gserb/AIQapi/master/model.json');
  return model
}

function processText(txt)
{
    out = txt.replace(/[^a-zA-Z0-9\s]/, '')
    out = out.trim().split(/\s+/)
    for (var i = 0 ; i < out.length ; i++)
    	out[i] = out[i].toLowerCase()
    return out
}

function loadDict()
{
    fs.readFile('dict.csv', 'utf8', function(err, data) {  
        if (err) throw err;
        success(data);
    });
}

function success(data)
{
    // load dictionary
    var wd_idx = new Object();
    lst = data.split(/\r?\n|\r/)

    for(var i = 0 ; i < lst.length ;i++){
        key = (lst[i]).split(',')[0]
        value = (lst[i]).split(',')[1]
        
        if(key == "")
            continue
        wd_idx[key] = parseInt(value)
        
    }
    
    word_index = wd_idx;

    // create_sequences
    max_tokens = 40 
    tokens = []
    words = processText(txt)
    seq = Array.from(Array(max_tokens), () => 0) 
    start = max_tokens-words.length;
    if(!word_index) return;
    for(var i= 0 ; i< words.length ; i++)
    {
        if (Object.keys(word_index).includes(words[i])){
            seq[i+start] = word_index[words[i]]
        }    
        
    }
    return seq
}

// function create_sequences(txt)
// {
//     max_tokens = 40 
//     tokens = []
//     words = processText(txt)
//     seq = Array.from(Array(max_tokens), () => 0) 
//     start = max_tokens-words.length;
//     if(!word_index) return;
//     for(var i= 0 ; i< words.length ; i++)
//     {
//         if (Object.keys(word_index).includes(words[i])){
//             seq[i+start] = word_index[words[i]]
//         }    
        
//     }
//     return seq
// }


async function init()
{
    console.log('Start loading dicionary')
    // loadDict();
    //console.log(word_index)
    console.log('Finish loading dicionary')
    seq = loadDict();
    // seq = create_sequences(txt) 
    console.log('Start loading model') 
    model = await createModel()
    console.log('Finish loading model') 
    input = tf.tensor(seq)
    input = input.expandDims(0)
    pred = model.predict(input)
    pred.print()
    console.log(txt);
    return pred.dataSync()[0];
}

word_index = undefined
init()


app.get('/api/sentiment', function(req, res) {

  txt = tweets[Math.floor(Math.random() * tweets.length)];

  init().then(function(result) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send({
      result,
      text: txt
    });
  });
  
});


// start the server
app.listen(PORT);
console.log('Server started! At http://localhost:' + PORT);