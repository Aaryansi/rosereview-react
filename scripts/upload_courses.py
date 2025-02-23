import os
import firebase_admin
from firebase_admin import credentials, firestore

# 🔹 Get the absolute path of the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(script_dir, "serviceAccountKey.json")  # Corrected path

# 🔹 Load Firebase credentials
if not firebase_admin._apps:  # Prevent re-initialization error
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
        exit(1)

# 🔹 Firestore database instance
db = firestore.client()

# 🔹 Mechanical Engineering (ME) Courses
me_courses = [
    {"code": "ME 123", "name": "Computer Programming"},
    {"code": "ME 193", "name": "Selected Topics in Design"},
    {"code": "ME 199", "name": "Professional Experience"},
    {"code": "ME 293", "name": "Selected Topics in Design"},
    {"code": "ME 301", "name": "Applications of Thermodynamics"},
    {"code": "ME 302", "name": "Heat Transfer"},
    {"code": "ME 304", "name": "Introduction to the Design of Mechanisms"},
    {"code": "ME 305", "name": "Introduction to Aerospace Engineering"},
    {"code": "ME 317", "name": "Design for Manufacturing"},
    {"code": "ME 321", "name": "Measurement Systems"},
    {"code": "ME 327", "name": "Numerical Methods of Engineering Analysis"},
    {"code": "ME 328", "name": "Materials Engineering"},
    {"code": "ME 359", "name": "Vehicle System Modeling"},
    {"code": "ME 393", "name": "Selected Topics in Design"},
    {"code": "ME 397", "name": "Special Topics in Mechanical Engineering"},
    {"code": "ME 401", "name": "Foundations of Fluid Mechanics"},
    {"code": "ME 402", "name": "Advanced Heat Transfer"},
    {"code": "ME 404", "name": "Advanced Design of Mechanisms"},
    {"code": "ME 405", "name": "Theoretical Aerodynamics"},
    {"code": "ME 406", "name": "Control Systems"},
    {"code": "ME 407", "name": "Power Plants"},
    {"code": "ME 408", "name": "Renewable Energy"},
    {"code": "ME 409", "name": "Air Conditioning"},
    {"code": "ME 410", "name": "Internal Combustion Engines"},
    {"code": "ME 411", "name": "Propulsion Systems"},
    {"code": "ME 412", "name": "Lean Manufacturing"},
    {"code": "ME 416", "name": "Introduction to MEMS: Fabrication & Applications"},
    {"code": "ME 417", "name": "Advanced Materials Engineering"},
    {"code": "ME 421", "name": "Mechanical Engineering Laboratory"},
    {"code": "ME 422", "name": "Finite Elements for Engineering Applications"},
    {"code": "ME 423", "name": "Fatigue"},
    {"code": "ME 424", "name": "Mechanics of Composites"},
    {"code": "ME 426", "name": "Turbomachinery"},
    {"code": "ME 427", "name": "Introduction to Computational Fluid Dynamics"},
    {"code": "ME 429", "name": "Experimental Fluid Mechanics"},
    {"code": "ME 430", "name": "Mechatronic Systems"},
    {"code": "ME 435", "name": "Robotics Engineering"},
    {"code": "ME 441", "name": "Advanced Modeling and Simulation Techniques"},
    {"code": "ME 445", "name": "Robot Dynamics and Control"},
    {"code": "ME 450", "name": "Combustion"},
    {"code": "ME 461", "name": "Aircraft Design"},
    {"code": "ME 462", "name": "Thermal Design"},
    {"code": "ME 470", "name": "Capstone Design I"},
    {"code": "ME 471", "name": "Capstone Design II"},
    {"code": "ME 472", "name": "Capstone Design III"},
    {"code": "ME 480", "name": "Machine Component Design"},
    {"code": "ME 490", "name": "Directed Research"},
    {"code": "ME 491", "name": "Directed Research"},
    {"code": "ME 493", "name": "Selected Topics in Design"},
    {"code": "ME 497", "name": "Special Topics in Mechanical Engineering"},
    {"code": "ME 501", "name": "Advanced Thermodynamics"},
    {"code": "ME 506", "name": "Advanced Control Systems"},
    {"code": "ME 510", "name": "Gas Dynamics"},
    {"code": "ME 516", "name": "Introduction to MEMS: Fabrication & Applications"},
    {"code": "ME 517", "name": "Mechanics of Metal Forming"},
    {"code": "ME 520", "name": "Computer-Aided Design & Manufacturing (CAD/CAM)"},
    {"code": "ME 522", "name": "Advanced Finite Element Analysis"},
    {"code": "ME 523", "name": "Fatigue"},
    {"code": "ME 524", "name": "Mechanics of Composites"},
    {"code": "ME 526", "name": "Turbomachinery"},
    {"code": "ME 527", "name": "Computational Fluid Dynamics"},
    {"code": "ME 536", "name": "Computational Intelligence in Control Engineering"},
    {"code": "ME 541", "name": "Advanced Modeling and Simulation Techniques"},
    {"code": "ME 545", "name": "Robot Dynamics and Control"},
    {"code": "ME 550", "name": "Combustion"},
    {"code": "ME 590", "name": "Thesis Research"},
    {"code": "ME 597", "name": "Selected Topics for Graduate Students"},
    {"code": "ME 699", "name": "Professional Experience"},
]

# 🔹 Function to upload courses to Firestore
def upload_courses(course_list, department):
    courses_ref = db.collection("courses")
    batch = db.batch()  # 🔥 Use batch writing for efficiency
    for course in course_list:
        course_ref = courses_ref.document(course["code"])
        course_data = {
            "department": department,
            "name": course["name"],
            "code": course["code"]
        }
        batch.set(course_ref, course_data)  # 🔥 Add to batch instead of individual writes

    batch.commit()  # 🔥 Commit all at once for efficiency
    print(f"✅ Successfully uploaded {len(course_list)} courses for {department}!")

if __name__ == "__main__":
    print("\n🚀 Uploading Mechanical Engineering (ME) courses to Firestore...")
    upload_courses(me_courses, "Mechanical Engineering")
    print("\n✅ All Mechanical Engineering courses uploaded successfully!")
