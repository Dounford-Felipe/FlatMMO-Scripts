function updatePremium() {
    let url;
    switch(data.vars.current_premium) {
        case "bronze":
            url = "https://flatmmo.com/images/ui/f_bronze_32.png";
            break;
        case "silver":
            url = "https://flatmmo.com/images/ui/f_silver_32.png";
            break;
        case "gold":
            url = "https://flatmmo.com/images/ui/f_gold_32.png";
            break;
        default:
            url = "https://flatmmo.com/images/items/diamond.png";
    }
    document.getElementById("profileIcon").src = url;
}