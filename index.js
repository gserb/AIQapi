const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const fs = require('fs');
const txt  = "Non-major bank ING has cut its fixed rates on investment loans by up to 36 basis points while lifting its fixed rates for owner-occupied";


async function createModel()
{
  const model = await tf.loadModel('file:///Users/ul14nw/Public/hackathonAIQ/model.json')
  return model
}

function process(txt)
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
    words = process(txt)
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

function create_sequences(txt)
{
    max_tokens = 40 
    tokens = []
    words = process(txt)
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


async function init(model)
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
}

word_index = undefined
init()