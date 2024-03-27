let vocabulary;

// Function to load JSON data
function loadData(language, callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", `${language}.json`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}

// Load vocabulary data for a specific language
function loadLanguageData(language) {
  loadData(language, function (response) {
    vocabulary = JSON.parse(response);
  });
}

let currentLanguage;

function selectLanguage(language) {
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.style.display = "block";
  document.getElementById("words").style.display = "none";
  currentLanguage = language;
  loadLanguageData(language); // Load vocabulary data for the selected language
}

function selectCategory(category) {
  const wordsList = document.getElementById("wordsList");
  wordsList.innerHTML = "";
  vocabulary[category].forEach((wordObj) => {
    const listItem = document.createElement("li");
    listItem.textContent = wordObj.word + " (" + wordObj.translation + ")";
    // Adding pronunciation using Responsive Voice API
    const pronunciation = wordObj.pronunciation || wordObj.word;
    const pronunciationIndicator = document.createElement("span");
    pronunciationIndicator.textContent = "🔊";
    pronunciationIndicator.classList.add("pronunciation-indicator");
    pronunciationIndicator.addEventListener("click", () => {
      pronounceWord(pronunciation, currentLanguage);
    });
    listItem.appendChild(pronunciationIndicator);
    wordsList.appendChild(listItem);
  });
  document.getElementById("words").style.display = "block";
}

function pronounceWord(word, language) {
  // Attempt to pronounce with the specified language
  responsiveVoice.speak(word, getVoiceForLanguage(language), {
    onerror: function () {
      // If pronunciation fails, fall back to a default language
      console.warn(
        "Failed to pronounce with the specified language. Falling back to US English Female."
      );
      responsiveVoice.speak(word, "US English Female");
    },
  });
}

function getVoiceForLanguage(language) {
  // Map language to supported voice
  const voiceMap = {
    arabic: "Arabic Female",
    spanish: "Spanish Female",
    french: "French Female",
    korean: "Korean Female",
    chinese: "Chinese Female",
    persian: "Arabic Female",
    russian: "Russian Female",
    thai: "Thai Female",
  };

  // Check if the language has a mapped voice, if not, use US English Female as default
  return voiceMap[language.toLowerCase()] || "US English Female";
}
