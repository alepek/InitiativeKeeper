$(function(){ //DOM Ready
 
	jQuery(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [180, 180],
        max_cols:8,        
    });
    Gridster = $(".gridster ul").gridster().data('gridster');
 
 	restorePreviousState();

 	jQuery(".addNewCharacter").click(function()
 	{
 		jQuery("#createCharacterModal").modal("show");
 		jQuery(".characterImages .thumbnail.active").removeClass("active");
 		jQuery("#characterNameInput").val("");
 	});
 	jQuery("#createNewCharacterButton").click(function()
 	{
 		var name = jQuery("#characterNameInput").val();
 		var image = jQuery(".characterImages .active img").prop("src");

 		if(!name || !image)
 		{
 			return;
 		}

 		var identifier = CharacterStore.GetNewCharacterIdentifier();
 		var character = {name:name, identifier:identifier, imageUrl:image};
 		CharacterStore.AddNewCharacter(character);
 		Gui.AddNewCharacter(character);
 		jQuery("#createCharacterModal").modal("hide");
 	});
 	jQuery(".clearStoredCharacters").click(function()
 	{
		jQuery("#removeCharactersModal").modal("show");
 	});
 	jQuery("#removeAllCharactersButton").click(function()
 	{
 		CharacterStore.ClearCharacters();
 		Gui.RemoveAllCharacters();
		jQuery("#removeCharactersModal").modal("hide");
 	});
 	jQuery(".characterImages .thumbnail").click(function()
 	{
		jQuery(".characterImages .thumbnail.active").removeClass("active");
		jQuery(this).addClass("active");
 	});
 	
});

function restorePreviousState(){

	if(!Modernizr.localstorage)
	{
		jQuery("#noLocalStoreSupport").modal("show");
		return;
	}
	jQuery(".neatgridster").fadeTo(0,0);

	var characters = CharacterStore.GetCharactersInLocalStore();
	if(!characters)
		return;

	for(var i=0;i<characters.length; i++)
	{
		var c = {};
		jQuery.extend(true, c, characters[i]);
		CharacterStore.AddNewCharacter(c);
	}
	Gui.UpdateFromStorage();

	jQuery(".neatgridster").delay(250).fadeTo(500,1);	
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}