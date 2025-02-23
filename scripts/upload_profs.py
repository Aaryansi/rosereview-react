import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firestore
cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# List of Chemistry & Biochemistry Professors
professors = [
    "Mark Brandt",
    "Rebecca DeVasher",
    "Fatima Husain",
    "Alexander Kamasah",
    "Amy Lane",
    "Dan Morris",
    "Mike Mueller",
    "Jason Pflueger",
    "Stephanie Poland",
    "Caleb Randolph",
    "Michelle Sharp",
    "Fumie Sunahori",
    "Luanne Tilstra",
    "Ross Weatherman",
    "Allen White",
    "Shelly Winkle",
    "Ray Zhu"
]

# Upload professors to Firestore
for prof in professors:
    doc_ref = db.collection("profs").document()
    doc_ref.set({
        "name": prof,
        "departments": ["Chemistry", "Biochemistry"]  # Assigning both departments
    })
    print(f"✅ Added: {prof}")

print("🎉 All professors uploaded successfully!")
