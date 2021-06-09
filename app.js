const inputBtn = document.querySelector('.inputBtn')
const filterTweet = document.querySelector('.filterTweet')
const addBtn = document.querySelector('.addProduct')
const listData = document.querySelector('.collection')
const msg = document.querySelector('.msg');
const formElm = document.querySelector('form')
const keyNum = document.querySelector('.keyNum span')
let num=0

let tweetData = getDataFromLocalStorage()

function getDataFromLocalStorage(){
    let tweets = ''
    if(localStorage.getItem('tweetItems') === null){
        tweets= [];
    } else {
        tweets = JSON.parse(localStorage.getItem('tweetItems'))
    }
    return tweets;
}

function saveDataTolocalStorage(tweet){
    let tweets = ''
    if(localStorage.getItem('tweetItems') === null){
        tweets= [];
        tweets.push(tweet)
        localStorage.setItem('tweetItems',JSON.stringify(tweets))
    } else {
        tweets = JSON.parse(localStorage.getItem('tweetItems'))
        tweets.push(tweet)
        localStorage.setItem('tweetItems',JSON.stringify(tweets))
    }
}

function deleteItemFromLocalStorage(id){
    const items = JSON.parse(localStorage.getItem('tweetItems'))
    const result = items.filter((tweetItem) => {
        return tweetItem.id !== id
    })
    localStorage.setItem('tweetItems',JSON.stringify(result))
    if(result.length === 0) location.reload();
}

function loadEventListener(){
    addBtn.addEventListener('click', addTweet)
    filterTweet.addEventListener('keyup', filteringByTweet)
    listData.addEventListener('click',modifyOrDeleteItem)
    inputBtn.addEventListener('keydown',checkWordLimit)
}
const checkWordLimit = (e)=>{
    if (num < 150 && e.keyCode !== 8) {
        num++
    } else if (num > 0 && e.keyCode === 8) {
        num--
        addBtn.removeAttribute('disabled')
    } else if (num >= 150) {
        e.preventDefault()
        addBtn.setAttribute('disabled', 'disabled')
    }
    keyNum.textContent = num
}

function getData(tweetList){
    if(tweetData.length > 0){
        msg.innerHTML = ''
        tweetList.forEach(tweet => {
            const{id,tweetName} = tweet
            li = document.createElement('li')
            li.className = 'collection'
            li.id = `tweet-${id}`
            li.innerHTML = `<span>${id}</span>
            <span>${tweetName}</span>
            <span>${tweet.date} ${tweet.time} ${tweet.checkTimeFromNow}</span>
            <span>
            <button type="button" class="btn btn-default edit-tweet">Edit</button>
            <button type="button" class="btn btn-default delete-tweet">Delete</button>
            </span>`
            listData.appendChild(li)
        });
    }else {
        //msg.innerHTML = 'No item to show'
        //showMessage(true, null)

        showMessage('please add Tweet')
    }
}

getData(tweetData)

const addTweet = e => {
    e.preventDefault();
    const tweetName = inputBtn.value;
    const date = dayjs().format('MMM/DD/YYYY')
    const time = dayjs().format('LT')
    const checkTimeFromNow = dayjs().fromNow()
    let id = 0;
    if(tweetData.length == 0){
        id = 1;
    } else {
        id = tweetData[tweetData.length - 1].id + 1
    }
    const inputIsValid = validateInput(tweetName)
    if(inputIsValid){
        alert('its to long please short')
    } else {
        const data = {
            id,
            tweetName,
            date,
            time,
            checkTimeFromNow
        }
        saveDataTolocalStorage(data)
        tweetData.push(data)
        listData.innerHTML = ''
        getData(tweetData)
        num=0
        keyNum.textContent=num
        inputBtn.value=''
    }
    
}

const filteringByTweet = e => {
    const text = e.target.value.toLowerCase();
    let tweetlength = 0;
    document.querySelectorAll('.collection').forEach(tweet => {
        const tweetName = tweet.textContent.toLowerCase();
        if(tweetName.indexOf(text) === -1){
            tweet.style.display = 'none'
        } else {
            tweet.style.display = 'block';
            ++tweetlength;
        }
    })
    console.log(text)
    tweetlength > 0 ? showMessage() : showMessage('No tweet Found');
}

function validateInput(tweetName){
    return tweetName.length >= 1 && 250 <= tweetName.length
}

function findProductDataById(id){
    return tweetData.find(tweetItem => tweetItem.id === id)
}

const modifyOrDeleteItem = e => {
    const target = e.target.parentElement.parentElement
    const id = parseInt(target.id.split('-')[1])
    //console.log(id)
    if(e.target.classList.contains('edit-tweet')){
        const findProduct = findProductDataById(id)
        console.log(findProduct)
        if(!findProduct){
            alert('Invalid Data')
        } else {
            //console.log(inputBtn.value = findProduct.tweetName)
            inputBtn.value = findProduct.tweetName
            //hide add button
            addBtn.style.display = 'none'
            //create update button
            const updateButtonElm = `<button class='btn btn-primary btn-block update-product'>Update</button>`
            formElm.insertAdjacentHTML('beforeend',updateButtonElm)

            const updateElm = document.querySelector('.update-product')
            updateElm.addEventListener('click',(e) => {
                e.preventDefault();
                const inputIsValid = validateInput(inputBtn.value)
                if(inputIsValid){
                    alert('its to long please short')
                } else {
                    tweetData = tweetData.map((tweetItem) => {
                        if(tweetItem.id === id){
                            return {
                                ...tweetItem,
                                tweetName : inputBtn.value
                            }
                        } else {
                            return tweetItem
                        }
                    })
                    //add data to ui
                    listData.innerHTML = ''
                    getData(tweetData)

                    //change data to ui
                    inputBtn.value = ''
                    updateElm.style.display = 'none'
                    addBtn.style.display = 'block'
                    localStorage.setItem('tweetItems',JSON.stringify(tweetData))
                }
            })
        }
    } else if(e.target.classList.contains('delete-tweet')){
        e.target.parentElement.parentElement.remove(target)
        deleteItemFromLocalStorage(id)
        const result = tweetData.filter((tweet) =>{
            return tweet.id !== id
        })
        tweetData = result
    }
}

function showMessage(message = ''){
    msg.innerHTML = message
}



loadEventListener()