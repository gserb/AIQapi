var express = require('express');

var app = express();
const PORT = process.env.PORT || 8080;

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

global.fetch = require('node-fetch');
const fs = require('fs');

var tweets = [
    "Hungarian inflation is well above the central bank's target. But if the European Commission or the ECB downgrade Eurozone's economic and inflation outlook, it can derail all momentum",
    "Can't resist it? Enjoy it bankers! So, HSBC and ING bank reliance Industries executed their first blockchain based finance transaction. A huge time cut for transactions from 7-10 days to under 24hrs.",
    "HSBC India and ING news Bank Brussels successfully executed a blockchain enabled, live trade finance transaction",
    "ETTelecom | HSBC, ING Bank execute blockchain transaction with Reliance Industries",
    "A lot of technologists see data as the bank’s possession. The open banking regime now gives customers real ownership over that data - Melanie Evans, ING (2nd from left) - Open Banking Panel",
    "We don't think the slow down in Czech inflation is a game-changer for the central bank.",
    "World Bank, ING, & AXA Announce Fossil Fuel Divestment Worth Billions",
    "ING - BriefING Romania: The National Bank of Romania increased its end-2019 CPI forecast by 0.2 percentage points to 2.9% year-on-year ",
    "ING - Brazil: Fiscal policy in the drivers seat: Election results triggered an improvement in the fiscal outlook that should help extend the rally in local assets. The stronger currency helps the inflation outlook and reduces the central bank's incentive",
    "From 10 days to one: India conducts first blockchain cross-border trade: HSBC and ING Bank Brussels have been behind the first cross-border trade transaction using blockchain in India. Could this be just a taste of things to come?",
    "Slides from ING bank presentation at the  (European Central Bank).It shows how miniscule crypto still is, it's just a baby. We are all early adopters.",
    "ING Bank is Making Blockchain a Priority ",
    "How can companies simplify their HR management systems? Here is how ING Bank used a cloud-based solution to achieve this.",
    "Good decision from ING bank . They will not finance the Transmountain pipeline expansion.",
    "Consistently innovative & pragmatic, ING Bank is following a different path to rival banks testing of new cross-border payment rails: by investing €21m in Fintech TransferMate as immediate low-cost platform for international payments.",
    "Dutch news: ING Bank will share their consumer payment data with advertisers. Negative sentiment on twitter, but what if consumers benefit?",
    "thanks for taking over 15 + hours to respond to fraudulent activity for the 4th time on my Visa & taking your security so laid back!",
    "ING BANK reminds me of (an) Animal Farm: “All animals are equal, but some called, Ralp Hamers, are more equal than others”. ING is a shame and this probably the last call for the end of an era !",
    "Shame on you",
    "Dutch bank ING is replacing 5,800 people with machines, at a cost of $2 billion ",
    "Jack de Mooji, Area Lead Platform Strategy at ING news: there is a survey that showed that in the Netherlands people would rather go to the dentist than to the bank. We need to make the banking experience the best possible experience, including through partnerships. at Salón Hidalgo",
    "Environmentalists stage Brussels 'die-in' to accuse ING bank of 'greenwashing' dirty palm oil investments in countries like Sierra Leone",
    "Please reconsider advertising with skynews with their blatantly bigoted content. I may reconsider my choice of bank if they support such views. Thank you ",
    "Switched my savings from ing (0,03% a year) to another dutch bank (0,3% a year). Yes 10x!! ",
    "Unclean foreign investments in Sierra Leone the President must know: About activists last Tuesday staged a protest in front of the ING Bank in Brussels, carrying billboards reading: Stop toxic investments, reclaim human rights and stop green washing." ,
    "Non-major bank ING has cut its fixed rates on investment loans by up to 36 basis points while lifting its fixed rates for owner-occupied",
    "ING Bank: Germany: September trade data adds to recent evidence of the worst quarterly performance for the German economy since 2015. The first GDP estimate will be released next week on Wednesday.",
    "In the Netherlands one after the other bank is involved in fraud or a scandel like ING news and ABNAMRO News . How is that in other country’s? How did it go? Short bankers, long bitcoin ?",
    "How can a bank like you not have an English customer service? I've been trying to reach you for a problem for hours but I can get no help from you. Please help me as soon as possible.",
    "ING - Czech inflation slows down to 2.2% due to food prices: Inflation further slowed down to 2.2% in October after 2.3% in September and ended below the market and the central bank forecast. But we don't think this is a game changer for the central bank "
    ];

var txt  = "From 10 days to one: India conducts first blockchain cross-border trade: HSBC and ING Bank Brussels have been behind the first cross-border trade transaction using blockchain in India. Could this be just a taste of things to come?"

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