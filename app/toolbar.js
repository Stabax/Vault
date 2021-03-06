/* global M, authorization_passphrase, appConfig */

//Locals
var toolbarAdditionalToggles = [];

//Functions

/**
 * Checks if the stored passphrase equals the JSON config one
 */
function verifyAuthorization()
{
  if (appConfig.forceOrigin != "" && location.host != appConfig.forceOrigin) return;
  return (sha256(authorization_passphrase) == appConfig.passphrase);
}

/**
 * Inject admin tools/buttons to vault toolbar
 */
function unlockToolbar()
{
  if (!verifyAuthorization) return; //Requires authorization
  initVaultConfigModal();
  //Editor toggle injection
  var toggleEditorBtn = document.createElement("li");
  toggleEditorBtn.innerHTML = "<a id=\"toggleEditor\" class=\"btn-floating blue darken-1 tooltipped inactive\" data-position=\"top\" data-tooltip=\"Toggle Editor\"><i class=\"material-icons\">create</i></a>";
  toggleEditorBtn.addEventListener("click", function() { toggleEditor(true); });
  toolbarAdditionalToggles.push(toggleEditorBtn);
  toolbar.querySelector("ul").appendChild(toggleEditorBtn);
  //Vault config opener injection
  var vaultConfigBtn = document.createElement("li");
  vaultConfigBtn.innerHTML = "<a id=\"vaultConfig\" href=\"#modal_config\" class=\"btn-floating blue darken-1 tooltipped modal-trigger\" data-position=\"top\" data-tooltip=\"Configure Vault\"><i class=\"material-icons\">settings</i></a>";
  toolbarAdditionalToggles.push(vaultConfigBtn);
  toolbar.querySelector("ul").appendChild(vaultConfigBtn);
  initToolbar(); //Init newly added buttons
}

/**
 * Locks toolbar and removes admin tools/buttons from toolbar
 */
function lockToolbar()
{
  if (isEditorEnabled()) //Check editior state, return if enabled
  {
    M.toast({html: "<span>Quit edition mode before locking vault.</span>"});
    return (false);
  }
  for (let toggle in toolbarAdditionalToggles) 
  {
    toolbar.querySelector("ul").removeChild(toolbarAdditionalToggles[toggle]); //Remove additional toggles
  }
  toolbarAdditionalToggles = []; //clear array
  return (true);
}

/**
 * Initialize base toolbar with JS anims
 */
function initToolbar() {

  // Different behavior beetween mobile/tablet and desktop versions
  if(screen.width > 992)
  {
    var toolbarParams = {
      direction: "left",
      hoverEnabled: true
    };
  } 
  else
  {
    var toolbarParams = {
      direction: "top",
      hoverEnabled: false
    };
  }
  M.FloatingActionButton.init(toolbar, toolbarParams);
  var activeTooltips = document.querySelectorAll(".tooltipped");
  for (var tooltip in activeTooltips)
  {
    M.Tooltip.init(activeTooltips[tooltip], {exitDelay: 2});
  }
  document.getElementById("scrollHome").addEventListener("click", function() { appCursor = 0; document.getElementById("app-container").scroll(0,0); }); //Bind scrollTop handler
  document.getElementById("unlockVault").addEventListener("click", authenticate); //Bind unlocking handler
}
