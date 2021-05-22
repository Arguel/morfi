"use strict"; const userFiltersBase = {sortby: "", region: [], discount: [], customDiscount: "", ratings: [], payment: [], promotions: [], delivery: [], price: [], customPrice: "", customSearch: ""}, templateShopLi = document.getElementById("template-item-li").content, shopItems = document.getElementById("shop-items-display"), cartMiniIcon = document.querySelector("span.position-absolute.top-0.start-100.translate-middle.badge.rounded-pill.bg-primary.h-pointer span"), mainShopContainer = document.getElementById("main-shop-container"), filtersBtnsContainer = document.getElementById("filters-btns-container"), arrayInactiveBtns = [...filtersBtnsContainer.querySelectorAll(".sel-none")]; let cart = JSON.parse(localStorage.getItem("cart")) || {}; const cleanAllFiltersBtn = document.getElementById("clean-all-filters"), ratingBtnsArray = document.querySelectorAll(".sel-none[data-stars]"), sortByLabel = document.getElementById("sortby"), minPriceInput = document.getElementById("pri-from"), maxPriceInput = document.getElementById("pri-to"), priceFilterBtn = document.getElementById("price-filter"), minDiscountInput = document.getElementById("dis-from"), maxDiscountInput = document.getElementById("dis-to"), discountFilterBtn = document.getElementById("discount-filter"), searchInput = document.getElementById("s-shop"), searchFilterBtn = document.getElementById("si-shop"), itemImageSelector = "img", itemTitleSelector = "h5 a", itemFinalPriceSelector = "div.ff-mont-6 span", finalPriceParentSelector = "div.ff-mont-6", priceAndShippingSelector = "div.overflow-hidden.text-truncate-2", itemDescriptionSelector = "div.text-truncate", addToCartSelector = ".btn-primary", fullItemSelector = ".border.m-2.rounded", shippingTagSelector = "span.text-green-5 span.visually-hidden", itemUnitsSelector = "span.mx-2.text-darker-4.d-none", filterCrossIconSelector = ".sel-primary .fa-times", productCartBtnSelector = "button.btn.btn-primary.d-block.w-100.ff-lato-4", loadingIconSelector = "div.spinner-grow.text-secondary.my-2", originalPriceSelector = "span.text-decoration-line-through.me-1", promotionBadgeSelector = "span.badge.bg-primary.me-1", clearSectionFilterBtnSelector = "div.col-md-3.text-end", fragment = document.createDocumentFragment(); for (const e of ratingBtnsArray) e.addEventListener("click", t => {if (!e.classList.contains("sel-primary")) {t.stopPropagation(); const r = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}, n = `${e.dataset.stars} star`; filtersEvents(e, r, "ratings", n), renderClearBtn(t.target, "ratings"), r.ratings.includes(n) || (r.ratings = [...r.ratings, n]), localStorage.setItem("filters", JSON.stringify(r)), updateListing(!1)} }); let apiShopItems; sortByLabel.addEventListener("change", () => {const e = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; filtersConfigHandler(sortByLabel.value, e, null, !1), updateListing(!1)}), priceFilterBtn.addEventListener("click", e => {priceAndDiscountFilter(e, minPriceInput, maxPriceInput, "customPrice", "price", "CustomPrice: ")}), discountFilterBtn.addEventListener("click", e => {priceAndDiscountFilter(e, minDiscountInput, maxDiscountInput, "customDiscount", "discount", "CustomDiscount: ")}), searchInput.closest("form").addEventListener("submit", e => {e.preventDefault(), searchFilter(e)}), searchFilterBtn.addEventListener("click", e => {searchFilter(e)}), cleanAllFiltersBtn.addEventListener("click", e => {e.stopPropagation(), localStorage.setItem("filters", JSON.stringify({...userFiltersBase})), updateListing(!1); const t = document.querySelectorAll(filterCrossIconSelector), r = document.querySelectorAll(clearSectionFilterBtnSelector); if (r) for (const e of r) e.parentNode.removeChild(e); if (t) {for (const e of t) {const t = e.closest("li"); t.removeChild(t.lastChild), t.firstElementChild.classList.remove("sel-primary"), t.firstElementChild.classList.add("sel-none")} minPriceInput.value = "", maxPriceInput.value = "", minDiscountInput.value = "", maxDiscountInput.value = "", sortByLabel.value = "Featured"} }), mainShopContainer.addEventListener("click", e => {e.stopPropagation(), e.target.matches(productCartBtnSelector) && (addToCart(e), renderCartIcons(cart)), e.target.classList.contains("sel-none") && filtersClickHandler(e)}), document.addEventListener("DOMContentLoaded", () => {fetchShopItems()}); const fetchShopItems = async (e = !0) => {try {await $.ajax({url: "../../js/api.json", method: "GET"}).done(e => {document.querySelector(loadingIconSelector).classList.add("d-none"), apiShopItems = e}), 0 !== (apiShopItems = filterResults(apiShopItems, e)).length ? (renderCartIcons(cart), renderShopItems(apiShopItems)) : (renderCartIcons(cart), renderPageError("no items found", !0))} catch (e) {renderPageError(e)} }; function renderPageError(e, t = !1) {shopItems.innerHTML = ""; const r = document.createElement("h4"); if (r.classList.add("text-center", "my-4", "mx-4", "fw-bold", "ff-lato-4"), r.textContent = "Error while loading items.", t) {r.textContent = "Oops... we didn't find anything for this search :("; const e = document.createElement("h5"); e.classList.add("text-center", "mx-4", "ff-lato-4"), e.textContent = "You can try a more general term or check that it is well written", fragment.appendChild(r), fragment.appendChild(e)} else console.log(e), fragment.appendChild(r); shopItems.appendChild(fragment)} function renderCartIcons(e) {const t = Object.values(e).reduce((e, {quantity: t}) => e + t, 0); cartMiniIcon.textContent = t <= 9 ? t : "+9"} function renderShopItems(e) {shopItems.innerHTML = ""; let t = !1; var r; function n() {const e = document.createElement("div"); return e.classList.add("text-break", "text-truncate-1"), t = !0, e} e.forEach(e => {const i = templateShopLi.querySelector(itemImageSelector), a = e.title.toLowerCase().replaceAll(" ", "-"); i.setAttribute("src", e.thumnailUrl), i.setAttribute("alt", a); const s = document.createElement("span"); if (s.classList.add("mx-2", "text-darker-4", "d-none"), s.textContent = `[u/${e.unitsAvailable}]`, templateShopLi.querySelector(finalPriceParentSelector).appendChild(s), templateShopLi.querySelector(itemTitleSelector).textContent = e.title, templateShopLi.querySelector(itemFinalPriceSelector).textContent = `$${(e.price - e.price * e.discount / 100).toFixed(2)}`, e.hasFreeShipping) {const e = document.createElement("span"); e.classList.add("badge", "bg-white", "rounded", "text-green-5"); const t = document.createElement("span"); t.classList.add("visually-hidden"), t.textContent = "Free shipping", e.appendChild(t); const r = document.createElement("i"); r.classList.add("fas", "fa-truck"), e.appendChild(r), templateShopLi.querySelector(finalPriceParentSelector).appendChild(e)} if (e.hasDiscount) {r = n(); const t = document.createElement("span"); t.classList.add("text-decoration-line-through", "me-1"), t.textContent = `$${e.price.toFixed(2)}`, r.appendChild(t)} 0 !== e.promotion.length && (t || (r = n()), e.promotion.forEach(e => {const t = document.createElement("span"); t.classList.add("badge", "bg-primary", "me-1"), t.textContent = e, r.appendChild(t)})), t && templateShopLi.querySelector(priceAndShippingSelector).appendChild(r), templateShopLi.querySelector(itemDescriptionSelector).textContent = e.description, templateShopLi.querySelector(addToCartSelector).dataset.id = e.id; const o = templateShopLi.cloneNode(!0); if (fragment.appendChild(o), t) {const e = templateShopLi.querySelector(priceAndShippingSelector); e.removeChild(e.lastChild), t = !1} if (e.hasFreeShipping) {const e = templateShopLi.querySelector(finalPriceParentSelector); e.removeChild(e.lastChild)} templateShopLi.querySelector(finalPriceParentSelector).removeChild(s)}), shopItems.appendChild(fragment)} function addToCart(e) {e.stopPropagation(), setToCart(e.target.closest(fullItemSelector))} function setToCart(e) {cart = JSON.parse(localStorage.getItem("cart")) || {}; let t = !1; null !== e.querySelector(shippingTagSelector) && (t = !0); let r = e.querySelector(itemFinalPriceSelector).textContent; r = parseFloat(r.substr(1)); const n = e.querySelector(originalPriceSelector); let i, a = !1; if (null !== n) {i = parseFloat(n.textContent.substr(1)); const t = e.querySelector(promotionBadgeSelector); a = parseInt(t.textContent)} else i = r; const s = parseInt(e.querySelector(itemUnitsSelector).textContent.substr(3)), o = {price: i, finalPrice: r, id: e.querySelector(addToCartSelector).dataset.id, title: e.querySelector(itemTitleSelector).textContent, thumnailUrl: e.querySelector(itemImageSelector).getAttribute("src"), hasFreeShipping: t, hasDiscount: a, unitsAvailable: s, quantity: 1}; cart.hasOwnProperty(o.id) && (o.quantity = cart[o.id].quantity + 1), cart[o.id] = {...o}, localStorage.setItem("cart", JSON.stringify(cart))} function filterResults(e, t) {const r = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; for (const n in r) e = filtersConfigHandler(r[n], r, null, t); return e} function filtersClickHandler(e) {const t = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; filtersConfigHandler(e.target.textContent, t, e.target, !1), updateListing(!1)} function filtersConfigHandler(e, t, r, n) {if (Array.isArray(e) && 0 !== e.length) for (const r of e) filtersConfigHandler(r, t, null, n); if ("string" == typeof e) {switch (e) {case "Featured": apiShopItems = Object.values(apiShopItems).sort(e => e.id), t.sortby = "Featured", sortByLabel.value = "Featured"; break; case "Low to high": apiShopItems = Object.values(apiShopItems).sort((e, t) => e.price - t.price), t.sortby = "Low to high", sortByLabel.value = "Low to high"; break; case "High to low": apiShopItems = Object.values(apiShopItems).sort((e, t) => t.price - e.price), t.sortby = "High to low", sortByLabel.value = "High to low"; break; case "North America": apiShopItems = Object.values(apiShopItems).filter(e => e.region.includes("North America")), t.region.includes("North America") || (t.region = [...t.region, "North America"]), n && (r = arrayInactiveBtns.filter(e => "North America" === e.innerText)[0]), filtersEvents(r, t, "region", "North America"), renderClearBtn(r, "region"); break; case "United States": apiShopItems = Object.values(apiShopItems).filter(e => e.region.includes("United States")), t.region.includes("United States") || (t.region = [...t.region, "United States"]), n && (r = arrayInactiveBtns.filter(e => "United States" === e.innerText)[0]), filtersEvents(r, t, "region", "United States"), renderClearBtn(r, "region"); break; case "Europe": apiShopItems = Object.values(apiShopItems).filter(e => e.region.includes("Europe")), t.region.includes("Europe") || (t.region = [...t.region, "Europe"]), n && (r = arrayInactiveBtns.filter(e => "Europe" === e.innerText)[0]), filtersEvents(r, t, "region", "Europe"), renderClearBtn(r, "region"); break; case "Global": apiShopItems = Object.values(apiShopItems).filter(e => e.region.includes("Global")), t.region.includes("Global") || (t.region = [...t.region, "Global"]), n && (r = arrayInactiveBtns.filter(e => "Global" === e.innerText)[0]), filtersEvents(r, t, "region", "Global"), renderClearBtn(r, "region"); break; case "25%": apiShopItems = Object.values(apiShopItems).filter(e => e.discount >= 25), t.discount.includes("25%") || (t.discount = [...t.discount, "25%"]), n && (r = arrayInactiveBtns.filter(e => "25%" === e.innerText)[0]), filtersEvents(r, t, "discount", "25%"), renderClearBtn(r, "discount"); break; case "50%": apiShopItems = Object.values(apiShopItems).filter(e => e.discount >= 50), t.discount.includes("50%") || (t.discount = [...t.discount, "50%"]), n && (r = arrayInactiveBtns.filter(e => "50%" === e.innerText)[0]), filtersEvents(r, t, "discount", "50%"), renderClearBtn(r, "discount"); break; case "75%": apiShopItems = Object.values(apiShopItems).filter(e => e.discount >= 75), t.discount.includes("75%") || (t.discount = [...t.discount, "75%"]), n && (r = arrayInactiveBtns.filter(e => "75%" === e.innerText)[0]), filtersEvents(r, t, "discount", "75%"), renderClearBtn(r, "discount"); break; case "100%": apiShopItems = Object.values(apiShopItems).filter(e => e.discount >= 100), t.discount.includes("100%") || (t.discount = [...t.discount, "100%"]), n && (r = arrayInactiveBtns.filter(e => "100%" === e.innerText)[0]), filtersEvents(r, t, "discount", "100%"), renderClearBtn(r, "discount"); break; case "1 star": apiShopItems = Object.values(apiShopItems).filter(e => e.rating >= 1), n && (r = arrayInactiveBtns.filter(e => "1" === e.dataset.stars)[0]), filtersEvents(r, t, "ratings", "1 star"), renderClearBtn(r, "ratings"); break; case "2 star": apiShopItems = Object.values(apiShopItems).filter(e => e.rating >= 2), n && (r = arrayInactiveBtns.filter(e => "2" === e.dataset.stars)[0]), filtersEvents(r, t, "ratings", "2 star"), renderClearBtn(r, "ratings"); break; case "3 star": apiShopItems = Object.values(apiShopItems).filter(e => e.rating >= 3), n && (r = arrayInactiveBtns.filter(e => "3" === e.dataset.stars)[0]), filtersEvents(r, t, "ratings", "3 star"), renderClearBtn(r, "ratings"); break; case "4 star": apiShopItems = Object.values(apiShopItems).filter(e => e.rating >= 4), n && (r = arrayInactiveBtns.filter(e => "4" === e.dataset.stars)[0]), filtersEvents(r, t, "ratings", "4 star"), renderClearBtn(r, "ratings"); break; case "In 12 installments": apiShopItems = Object.values(apiShopItems).filter(e => e.payment.includes("In 12 installments")), t.payment.includes("In 12 installments") || (t.payment = [...t.payment, "In 12 installments"]), n && (r = arrayInactiveBtns.filter(e => "In 12 installments" === e.innerText)[0]), filtersEvents(r, t, "payment", "In 12 installments"), renderClearBtn(r, "payment"); break; case "In 6 installments": apiShopItems = Object.values(apiShopItems).filter(e => e.payment.includes("In 6 installments")), t.payment.includes("In 6 installments") || (t.payment = [...t.payment, "In 6 installments"]), n && (r = arrayInactiveBtns.filter(e => "In 6 installments" === e.innerText)[0]), filtersEvents(r, t, "payment", "In 6 installments"), renderClearBtn(r, "payment"); break; case "In cash": apiShopItems = Object.values(apiShopItems).filter(e => e.payment.includes("In cash")), t.payment.includes("In cash") || (t.payment = [...t.payment, "In cash"]), n && (r = arrayInactiveBtns.filter(e => "In cash" === e.innerText)[0]), filtersEvents(r, t, "payment", "In cash"), renderClearBtn(r, "payment"); break; case "Special offer": apiShopItems = Object.values(apiShopItems).filter(e => e.promotion.includes("Special offer")), t.promotions.includes("Special offer") || (t.promotions = [...t.promotions, "Special offer"]), n && (r = arrayInactiveBtns.filter(e => "Special offer" === e.innerText)[0]), filtersEvents(r, t, "promotions", "Special offer"), renderClearBtn(r, "promotions"); break; case "New": apiShopItems = Object.values(apiShopItems).filter(e => e.promotion.includes("New")), t.promotions.includes("New") || (t.promotions = [...t.promotions, "New"]), n && (r = arrayInactiveBtns.filter(e => "New" === e.innerText)[0]), filtersEvents(r, t, "promotions", "New"), renderClearBtn(r, "promotions"); break; case "Free shipping": apiShopItems = Object.values(apiShopItems).filter(e => e.hasFreeShipping), t.delivery.includes("Free shipping") || (t.delivery = [...t.delivery, "Free shipping"]), n && (r = arrayInactiveBtns.filter(e => "Free shipping" === e.innerText)[0]), filtersEvents(r, t, "delivery", "Free shipping"), renderClearBtn(r, "delivery"); break; case "Withdrawal in person": apiShopItems = Object.values(apiShopItems).filter(e => !e.hasFreeShipping), t.delivery.includes("Withdrawal in person") || (t.delivery = [...t.delivery, "Withdrawal in person"]), n && (r = arrayInactiveBtns.filter(e => "Withdrawal in person" === e.innerText)[0]), filtersEvents(r, t, "delivery", "Withdrawal in person"), renderClearBtn(r, "delivery"); break; case "$0 - $10": apiShopItems = Object.values(apiShopItems).filter(e => e.price > 0 && e.price <= 10), t.price.includes("$0 - $10") || (t.price = [...t.price, "$0 - $10"]), n && (r = arrayInactiveBtns.filter(e => "$0 - $10" === e.innerText)[0]), filtersEvents(r, t, "price", "$0 - $10"), renderClearBtn(r, "price"); break; case "$10 - $50": apiShopItems = Object.values(apiShopItems).filter(e => e.price > 10 && e.price <= 50), t.price.includes("$10 - $50") || (t.price = [...t.price, "$10 - $50"]), n && (r = arrayInactiveBtns.filter(e => "$10 - $50" === e.innerText)[0]), filtersEvents(r, t, "price", "$10 - $50"), renderClearBtn(r, "price"); break; case "$50 - $100": apiShopItems = Object.values(apiShopItems).filter(e => e.price > 50 && e.price <= 100), t.price.includes("$50 - $100") || (t.price = [...t.price, "$50 - $100"]), n && (r = arrayInactiveBtns.filter(e => "$50 - $100" === e.innerText)[0]), filtersEvents(r, t, "price", "$50 - $100"), renderClearBtn(r, "price"); break; case "$100+": apiShopItems = Object.values(apiShopItems).filter(e => e.price > 100), t.price.includes("$100+") || (t.price = [...t.price, "$100+"]), n && (r = arrayInactiveBtns.filter(e => "$100+" === e.innerText)[0]), filtersEvents(r, t, "price", "$100+"), renderClearBtn(r, "price")}if (e.startsWith("CustomPrice:")) {renderClearBtn(minPriceInput, "customPrice"); const t = e.split("-").map(e => e.replace(/\D/g, "")); apiShopItems = Object.values(apiShopItems).filter(e => e.price >= parseInt(t[0]) && e.price <= parseInt(t[1])), minPriceInput.value = t[0], maxPriceInput.value = t[1]} if (e.startsWith("CustomDiscount:")) {renderClearBtn(minDiscountInput, "customDiscount"); const t = e.split("-").map(e => e.replace(/\D/g, "")); apiShopItems = Object.values(apiShopItems).filter(e => e.discount >= parseInt(t[0]) && e.discount <= parseInt(t[1])), minDiscountInput.value = t[0], maxDiscountInput.value = t[1]} if (e.startsWith("CustomSearch:")) {const t = e.substr(14); apiShopItems = Object.values(apiShopItems).filter(e => e.title.toLowerCase().startsWith(t.toLowerCase())), searchInput.value = t} } return localStorage.setItem("filters", JSON.stringify(t)), apiShopItems} function filtersEvents(e, t, r, n) {if (e) {e.classList.remove("sel-none"), e.classList.add("sel-primary"); const i = document.createElement("button"); i.classList.add("sel-primary"); const a = document.createElement("i"); a.classList.add("fas", "fa-times"), i.appendChild(a), i.addEventListener("click", a => {if (a.stopPropagation(), t = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}, i.parentNode.removeChild(i), e.classList.remove("sel-primary"), e.classList.add("sel-none"), t[r].splice(t[r].indexOf(n), 1), 0 === t[r].length || "" === t[r]) {const t = e.closest("div").firstElementChild; t.removeChild(t.lastChild)} localStorage.setItem("filters", JSON.stringify(t)), updateListing(!1)}), e.parentNode.appendChild(i)} } function updateListing(e) {document.querySelector(loadingIconSelector).classList.remove("d-none"), fetchShopItems(e)} function renderClearBtn(e, t) {if (e) {const r = e.closest("div"), n = e.closest("div").firstElementChild; if (!n.querySelector(clearSectionFilterBtnSelector)) {const e = document.createElement("div"); e.classList.add("col-md-3", "text-end"); const i = document.createElement("button"); i.classList.add("sel-none"); const a = document.createElement("span"); a.classList.add("h-pointer", "h-underline"), a.textContent = "Clear", i.appendChild(a), i.addEventListener("click", e => {e.stopPropagation(); const i = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; n.removeChild(n.lastChild), i[t] = []; const a = r.querySelectorAll(filterCrossIconSelector); for (let e of a) {const t = e.closest("li"); t.removeChild(t.lastChild), t.firstElementChild.classList.remove("sel-primary"), t.firstElementChild.classList.add("sel-none")} switch (t) {case "price": case "customPrice": i.customPrice = "", minPriceInput.value = "", maxPriceInput.value = ""; break; case "discount": case "customDiscount": i.customDiscount = "", minDiscountInput.value = "", maxDiscountInput.value = ""}localStorage.setItem("filters", JSON.stringify(i)), updateListing(!1)}), e.appendChild(i), n.appendChild(e)} } } function searchFilter(e) {e.stopPropagation(); const t = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; "" !== searchInput.value ? (apiShopItems = Object.values(apiShopItems).filter(e => e.title.toLowerCase().startsWith(searchInput.value.toLowerCase())), t.customSearch = `CustomSearch: ${searchInput.value}`) : t.customSearch = "", localStorage.setItem("filters", JSON.stringify(t)), updateListing(!1)} function priceAndDiscountFilter(e, t, r, n, i, a) {e.stopPropagation(); const s = JSON.parse(localStorage.getItem("filters")) || {...userFiltersBase}; t.value = t.value.replace(/[e\+\-]/gi, ""), r.value = r.value.replace(/[e\+\-]/gi, ""), "" !== t.value && "" !== r.value ? (apiShopItems = Object.values(apiShopItems).filter(e => e[i] >= parseInt(t.value) && e[i] <= parseInt(r.value)), s[n] = a + t.value + " - " + r.value) : s[n] = "", localStorage.setItem("filters", JSON.stringify(s)), updateListing(!1)}
