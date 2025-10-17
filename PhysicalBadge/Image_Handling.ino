// This function displays the image request.
// The lookup table using if statements makes me sad.
void displayImage(String imageID, int x, int y, uint8_t reduction) {
  RLEBitmapInfo bmImage;

	if (imageID == "BlueWren") {
			get_BlueWren_RLEBM(bmImage);
	} else if (imageID == "Logo") {
			get_BSides_Perth_2025_Logo_RLEBM(bmImage);
	} else if (imageID == "Cockatoo") {
			get_Cockatoo_RLEBM(bmImage);
	} else if (imageID == "Computer") {
			get_Computer_RLEBM(bmImage);
	} else if (imageID == "Cross") {
			get_Cross_RLEBM(bmImage);
	} else if (imageID == "Crow") {
			get_Crow_RLEBM(bmImage);
	} else if (imageID == "CyberEchidna") {
			get_CyberEchidna_RLEBM(bmImage);
	} else if (imageID == "Devil") {
			get_Devil_RLEBM(bmImage);
	} else if (imageID == "Dingo") {
			get_Dingo_RLEBM(bmImage);
	} else if (imageID == "Echidna") {
			get_Echidna_RLEBM(bmImage);
	} else if (imageID == "Emu") {
			get_Emu_RLEBM(bmImage);
	} else if (imageID == "Explosion") {
			get_Explosion_RLEBM(bmImage);
	} else if (imageID == "Kangaroo") {
			get_Kangaroo_RLEBM(bmImage);
	} else if (imageID == "Kookaburra") {
			get_Kookaburra_RLEBM(bmImage);
	} else if (imageID == "Lightning") {
			get_Lightning_RLEBM(bmImage);
	} else if (imageID == "Koala") {
			get_Koala_RLEBM(bmImage);
	} else if (imageID == "Parrot") {
			get_Parrot_RLEBM(bmImage);
	} else if (imageID == "Person") {
			get_Person_RLEBM(bmImage);
	} else if (imageID == "Person2") {
			get_Person2_RLEBM(bmImage);
	} else if (imageID == "Person3") {
			get_Person3_RLEBM(bmImage);
	} else if (imageID == "Person4") {
			get_Person4_RLEBM(bmImage);
	} else if (imageID == "Person5") {
			get_Person5_RLEBM(bmImage);
	} else if (imageID == "Person6") {
			get_Person6_RLEBM(bmImage);
	} else if (imageID == "Person7") {
			get_Person7_RLEBM(bmImage);
	} else if (imageID == "Snake") {
			get_Snake_RLEBM(bmImage);
	} else if (imageID == "Spider") {
			get_Spider_RLEBM(bmImage);
	} else if (imageID == "Tick") {
			get_Tick_RLEBM(bmImage);
	} else if (imageID == "Warning") {
			get_Warning_RLEBM(bmImage);
	} else if (imageID == "WiFi") {
			get_WiFi_RLEBM(bmImage);
	} else if (imageID == "Wombat") {
			get_Wombat_RLEBM(bmImage);
	} else {
		return;
	}

	if (bmImage.width!=0) renderRLEBitmap(bmImage, x, y, &tft, true, reduction);
}