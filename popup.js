let btn = document.getElementById("extractLinks");
let results = document.getElementById("results");
let searchQuery = document.getElementById("searchQuery");
let linksList = document.getElementById("linksList");
var linkElements;
import SECRET_KEY from "./Config";
import { CX } from "./Config";

document.addEventListener('DOMContentLoaded', function () {
    // Check the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      if (currentTab.url.includes("https://leetcode.com/problems/")) {
        // Enable the button
        btn.disabled = false;
      }
    });
  });
btn.addEventListener('click', async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    var linkName = tab.url.split('/');
    let cnt = 0;
    let pos = -1;
    linkName.forEach(part => {
        if (part == "problems" || part == "challenges" || part == "practice" && pos == -1) {
            pos = cnt + 1;
        }
        cnt++
    });
    // console.log(linkName); 
    let html = "";
    const links = [];
    fetch(`https://www.googleapis.com/customsearch/v1?key=${SECRET_KEY}8&cx=${CX}&q=${linkName[pos]}`)
        .then(response => response.json())
        .then(data => {
    
            data.items.forEach(item => {
                if (!tab.url.includes(item.link) && !item.link.includes(tab.url) && !item.link.includes("solution") && !item.link.includes("discuss")) {
                    html += `<li><a class="extension-link" href=${item.link}>${item.link}</a></li>`
                }
            });
        })
        .then(() => {
            if(html==""){
                html = `<h4>Could not find similler problem!</h4>`
            }
            linksList.innerHTML = html;
            linkElements = document.querySelectorAll('.extension-link');
            linkElements.forEach(function (linkElement) {
                linkElement.addEventListener('click', function (event) {
                   
                    event.preventDefault();

                    var linkUrl = linkElement.getAttribute('href');
                    chrome.tabs.create({ url: linkUrl });
                });
            });
        })
        .catch(error => console.error('Error:', error));

})
