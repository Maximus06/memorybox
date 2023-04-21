import { App } from "./app.js";
import { UI } from "./UI.js";
import { Store } from "./store.js";
import { save, load, createCard, get_save_name } from "./api.js";


main();

function main() {
  if (document.querySelector("#card-container") === null) {
    console.log("on stop le chargement de app.js");
    return;
  }

  // check integrity of the card id (corruption sometimes happens)
  Store.checkDoublon();

  // Event: dom loaded
  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });

  // Event: click on one of the icon in the header of the card
  document.querySelector("#card-container").addEventListener("click", (e) => {
    // click on the eye to see  the solution
    if (e.target.classList.contains("fa-eye")) {
      const visibleCard = e.target.parentElement.parentElement.parentElement;
      const hiddenCard = visibleCard.nextElementSibling;
      hiddenCard.classList.toggle("d-none");
    }

    // click on the thumb up (card memorized)
    if (e.target.classList.contains("fa-thumbs-up")) {
      let id = Number(e.target.dataset.id);
      App.consolidateCard(true, id);
    }

    // click on the thumbs down (card not memorized)
    if (e.target.classList.contains("fa-thumbs-down")) {
      let id = Number(e.target.dataset.id);
      App.consolidateCard(false, id);
    }

    // click on the arrow right (Return card)
    if (e.target.classList.contains("fa-arrow-right")) {
      let id = Number(e.target.dataset.id);

      const visibleCard = e.target.parentElement.parentElement.parentElement;
      const hiddenCard = visibleCard.nextElementSibling;
      const titleH4 = visibleCard.querySelector(".card-title");
      const complementElement = visibleCard.querySelector(".card-text");
      const hideTitleH4 = hiddenCard.querySelector(".card-title");
      const hideComplementElement = hiddenCard.querySelector(".card-text");

      const titleTemp = titleH4.innerHTML;
      const complementTemp = complementElement.innerHTML;

      titleH4.innerHTML = hideTitleH4.innerHTML;
      complementElement.innerHTML = hideComplementElement.innerHTML;

      hideTitleH4.innerHTML = titleTemp;
      hideComplementElement.innerHTML = complementTemp;

      // update the db
      Store.changeCardSens(id);
    }
  });

  // Event : filter on click on different step
  document.querySelector("#step-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      // desactive the last step btn
      let btnStep = document.getElementById("btn-step-" + App.step);
      btnStep.classList.remove("active");
      // active the btn
      e.target.classList.add("active");

      // save the last step btn click
      App.step = Number(e.target.dataset.num);

      // const filterCards = App.cards.filter(card => card.step == App.step);
      App.refreshCardsList();
    }
  });

  // Event: change selected set
  document.getElementById("select-set").addEventListener("change", (e) => {
    let setSelected = "";
    // case 'label' option Selectionnez ... nothing to do
    if (e.target.options[e.target.value] === undefined) {
      return;
    }

    if (e.target.value === "0") {
      setSelected = "*";
    } else {
      setSelected = e.target.options[e.target.value].text;
    }

    App.step = 1;
    App.set = setSelected;

    App.refreshCardsList();

    UI.calcCardNumberByStep();
  });

  // Event: change selected theme
  document.getElementById("select-theme").addEventListener("change", (e) => {
    let themeSelected = "";
    // case 'label' option Selectionnez ... nothing to do
    // if (e.target.options[e.target.value] === undefined) {
    //    return;
    // }

    if (e.target.value === "0") {
      themeSelected = "*";
    } else {
      themeSelected = e.target.options[e.target.value].text;
    }

    App.step = 1;
    App.theme = themeSelected;

    App.refreshCardsList();
    UI.calcCardNumberByStep();
    UI.fillSetList(themeSelected);
  });

  // Copy the cards (from local storage) in the clipboard
  document.getElementById("backup").addEventListener("click", (e) => {
    navigator.clipboard.writeText(localStorage.getItem("cards"));
    e.target.innerHTML = "Backup (copié)";
  });

  // Copy the cards (from local storage) to the backcup server
  document.getElementById("backup-server").addEventListener("click", (e) => {
    console.log("sauvegarde demandé :>> ");
    const result = save().then((result)  => {
      console.log("save :>> ", result);
    });
    // const result = createCard();
  });

  // Load data  from a backup
  document.getElementById("load-server").addEventListener("click", (e) => {
    console.log("chargement demandé :>> ");
    const result = load().then((result)  => {
      console.log("save :>> ", result);
    });    
  });

  // load event
  document.getElementById("load").addEventListener("click", (e) => {
    e.preventDefault;
    console.log("chargement demandé :>> ");
    
    const name = get_save_name();
    // const result = load().then((result)  => {
    //   console.log("save :>> ", result);
    // });

  });


}
