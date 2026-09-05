"""
Seed script — run once after DB is created.
python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.database import SessionLocal, engine, Base
from app.models.models import (
    User, UserProfile, Video, YogaExercise, AncientPractice,
    GymExercise, Food, DietPlan
)
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed_videos():
    videos = [
        # Yoga
        {"youtube_id": "v7AYKMP6rOE", "title": "Sun Salutation for Beginners", "channel_name": "Yoga with Adriene", "category": "yoga", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg"},
        {"youtube_id": "149Iac5fmoE", "title": "Beginner Yoga Flow", "channel_name": "Yoga with Adriene", "category": "yoga", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/149Iac5fmoE/hqdefault.jpg"},
        {"youtube_id": "sTANio_2E0Q", "title": "Yoga for Flexibility", "channel_name": "Yoga with Adriene", "category": "yoga", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/sTANio_2E0Q/hqdefault.jpg"},
        {"youtube_id": "XeXz8fIZDCE", "title": "Warrior Yoga Sequence", "channel_name": "Yoga with Adriene", "category": "yoga", "difficulty": "intermediate", "thumbnail_url": "https://img.youtube.com/vi/XeXz8fIZDCE/hqdefault.jpg"},
        {"youtube_id": "g_tea8ZNk5A", "title": "Relaxation Yoga", "channel_name": "Yoga with Adriene", "category": "yoga", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/g_tea8ZNk5A/hqdefault.jpg"},
        # Pranayama
        {"youtube_id": "8VwufJrUhic", "title": "Nadi Shodhana Pranayama", "channel_name": "Art of Living", "category": "pranayama", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/8VwufJrUhic/hqdefault.jpg"},
        {"youtube_id": "YFUemtBqBFw", "title": "Kapalabhati Breathing", "channel_name": "Sadhguru", "category": "pranayama", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/YFUemtBqBFw/hqdefault.jpg"},
        {"youtube_id": "TmdfNFQNiU0", "title": "Bhramari Pranayama", "channel_name": "Yoga with Adriene", "category": "pranayama", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/TmdfNFQNiU0/hqdefault.jpg"},
        {"youtube_id": "1vx8iUpMFEA", "title": "Trataka Candle Gazing", "channel_name": "Sadhguru", "category": "meditation", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/1vx8iUpMFEA/hqdefault.jpg"},
        {"youtube_id": "inpok4MKVLM", "title": "Yoga Nidra Deep Relaxation", "channel_name": "Yoga Nidra Network", "category": "meditation", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg"},
        # Gym
        {"youtube_id": "rT7DgCr-3pg", "title": "Perfect Push-Up Form", "channel_name": "Athlean-X", "category": "chest", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg"},
        {"youtube_id": "Dybbiz4TQHQ", "title": "Squat Tutorial", "channel_name": "Athlean-X", "category": "legs", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/Dybbiz4TQHQ/hqdefault.jpg"},
        {"youtube_id": "XxWcirHIwVo", "title": "Pull-Up Progression", "channel_name": "Calisthenic Movement", "category": "back", "difficulty": "intermediate", "thumbnail_url": "https://img.youtube.com/vi/XxWcirHIwVo/hqdefault.jpg"},
        {"youtube_id": "1ZEnL4_7pBE", "title": "Plank Core Workout", "channel_name": "FitnessBlender", "category": "core", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/1ZEnL4_7pBE/hqdefault.jpg"},
        {"youtube_id": "ykJmrZ5v0Oo", "title": "Deadlift Technique", "channel_name": "Jeff Nippard", "category": "back", "difficulty": "intermediate", "thumbnail_url": "https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg"},
        {"youtube_id": "3VcKaXpzqRo", "title": "Bench Press Tutorial", "channel_name": "Jeff Nippard", "category": "chest", "difficulty": "intermediate", "thumbnail_url": "https://img.youtube.com/vi/3VcKaXpzqRo/hqdefault.jpg"},
        {"youtube_id": "WvLMauqrnK8", "title": "Overhead Press Form", "channel_name": "Athlean-X", "category": "shoulders", "difficulty": "intermediate", "thumbnail_url": "https://img.youtube.com/vi/WvLMauqrnK8/hqdefault.jpg"},
        {"youtube_id": "ykJmrZ5v0Oo", "title": "Burpee Full Body Cardio", "channel_name": "FitnessBlender", "category": "cardio", "difficulty": "beginner", "thumbnail_url": "https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg"},
    ]
    vid_objects = {}
    for v in videos:
        existing = db.query(Video).filter(Video.youtube_id == v["youtube_id"]).first()
        if not existing:
            obj = Video(**v)
            db.add(obj)
            db.flush()
            vid_objects[v["youtube_id"]] = obj.id
        else:
            vid_objects[v["youtube_id"]] = existing.id
    db.commit()
    return vid_objects


def seed_yoga(vid_map):
    yoga_data = [
        {
            "name": "Tadasana (Mountain Pose)",
            "slug": "tadasana-mountain-pose",
            "description": "The foundation of all standing poses. Tadasana teaches correct posture, alignment, and awareness of the body's center of gravity.",
            "category": "beginner",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Stand with feet together or hip-width apart, big toes touching.",
                "Distribute weight evenly across all four corners of your feet.",
                "Lift and spread your toes, then place them back down.",
                "Firm your thighs and lift the kneecaps without locking the knees.",
                "Lengthen your tailbone toward the floor and lift your pubic bone.",
                "Broaden your collarbones and let your shoulder blades draw down your back.",
                "Let your arms hang beside your torso, palms facing forward.",
                "Lengthen the crown of your head toward the ceiling. Breathe steadily."
            ],
            "benefits": [
                "Improves posture and body awareness",
                "Strengthens thighs, knees, and ankles",
                "Firms abdomen and buttocks",
                "Reduces flat feet",
                "Relieves sciatica"
            ],
            "precautions": [
                "If you have headaches or insomnia, practice with eyes closed.",
                "Those with low blood pressure should move into and out of this pose slowly."
            ],
            "video_youtube_id": "v7AYKMP6rOE",
        },
        {
            "name": "Surya Namaskar (Sun Salutation)",
            "slug": "surya-namaskar",
            "description": "A dynamic sequence of 12 postures flowing with the breath. Surya Namaskar is a complete practice in itself, warming every major muscle group.",
            "category": "strength",
            "difficulty": "beginner",
            "duration_minutes": 15,
            "instructions": [
                "Begin in Tadasana at the top of your mat, hands in prayer at the heart.",
                "Inhale: sweep arms overhead into Urdhva Hastasana.",
                "Exhale: fold forward into Uttanasana.",
                "Inhale: half-lift into Ardha Uttanasana, spine long.",
                "Exhale: step or jump back to plank. Lower to Chaturanga.",
                "Inhale: roll over toes into Upward-Facing Dog.",
                "Exhale: lift hips into Downward-Facing Dog. Hold 5 breaths.",
                "Inhale: step or jump feet to hands. Half-lift.",
                "Exhale: fold. Inhale: rise to standing with arms overhead.",
                "Exhale: return hands to heart. That completes one round."
            ],
            "benefits": [
                "Full-body warm-up and cardiovascular activation",
                "Strengthens arms, legs, and core simultaneously",
                "Improves spinal flexibility",
                "Stimulates abdominal organs",
                "Calms the mind through breath-movement coordination"
            ],
            "precautions": [
                "Avoid if you have wrist injuries — use fists or forearms.",
                "Skip Chaturanga if you have shoulder impingement.",
                "Pregnant women should modify after the first trimester."
            ],
            "video_youtube_id": "v7AYKMP6rOE",
        },
        {
            "name": "Balasana (Child's Pose)",
            "slug": "balasana-childs-pose",
            "description": "A gentle resting posture that stretches the hips, thighs, and ankles while calming the nervous system.",
            "category": "relaxation",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Kneel on the mat with big toes together, knees as wide as your hips.",
                "Sit back onto your heels.",
                "Fold your torso forward between your thighs.",
                "Extend arms forward or rest them alongside your body.",
                "Rest your forehead on the mat.",
                "Breathe deeply, allowing your belly to expand between your thighs.",
                "Hold for 1–3 minutes, releasing with each exhale."
            ],
            "benefits": [
                "Gently stretches hips, thighs, and ankles",
                "Relieves back and neck pain",
                "Calms the mind and relieves stress",
                "Stimulates the parasympathetic nervous system"
            ],
            "precautions": [
                "Avoid if you have knee injuries.",
                "If ankles are uncomfortable, place a rolled blanket under them.",
                "Pregnant women should spread knees wide to avoid compressing the belly."
            ],
            "video_youtube_id": "149Iac5fmoE",
        },
        {
            "name": "Adho Mukha Svanasana (Downward Dog)",
            "slug": "adho-mukha-svanasana",
            "description": "One of yoga's most recognized poses. Downward Dog is both a strengthening and lengthening posture, forming an inverted V-shape with the body.",
            "category": "flexibility",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Start on hands and knees, wrists under shoulders, knees under hips.",
                "Spread fingers wide, pressing firmly through the index fingers.",
                "Tuck toes and lift hips toward the ceiling.",
                "Straighten legs as much as possible, heels reaching toward the floor.",
                "Keep head between arms, ears in line with upper arms.",
                "Rotate upper arms outward to broaden the collarbones.",
                "Hold for 5–10 breaths."
            ],
            "benefits": [
                "Stretches hamstrings, calves, arches, and hands",
                "Strengthens arms and legs",
                "Energizes the body",
                "Relieves headaches, insomnia, and mild depression",
                "Improves digestion"
            ],
            "precautions": [
                "Avoid with carpal tunnel syndrome.",
                "Use a wall or blocks to reduce wrist load."
            ],
            "video_youtube_id": "sTANio_2E0Q",
        },
        {
            "name": "Virabhadrasana I (Warrior I)",
            "slug": "virabhadrasana-i",
            "description": "A standing pose that builds strength and stability in the legs while opening the chest and hips. Named after the warrior Virabhadra from Hindu mythology.",
            "category": "strength",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Stand in Tadasana. Step left foot back 3.5–4 feet.",
                "Turn left foot out to 45–60 degrees, keeping right foot pointing forward.",
                "Align right heel with left heel.",
                "Bend right knee directly over right ankle.",
                "Raise arms perpendicular to the floor, palms facing each other.",
                "Firm shoulder blades against the back, lift through the side chest.",
                "Hold for 5–10 breaths, then repeat on the other side."
            ],
            "benefits": [
                "Strengthens shoulders, arms, legs, ankles, and back",
                "Opens hips, chest, and lungs",
                "Improves focus, balance, and stability",
                "Energizes the entire body"
            ],
            "precautions": [
                "Avoid if you have high blood pressure.",
                "Students with neck problems should keep the head in a neutral position."
            ],
            "video_youtube_id": "XeXz8fIZDCE",
        },
        {
            "name": "Vrikshasana (Tree Pose)",
            "slug": "vrikshasana-tree-pose",
            "description": "A one-legged balancing pose that improves concentration, balance, and coordination.",
            "category": "beginner",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Stand in Tadasana. Shift weight to the left foot.",
                "Bend the right knee and place the right foot on the inner left thigh or calf (never the knee).",
                "Bring palms together at the heart center.",
                "Fix your gaze on a still point in front of you.",
                "Optionally raise arms overhead, palms together.",
                "Hold for 30 seconds to 1 minute. Repeat on the other side."
            ],
            "benefits": [
                "Strengthens thighs, calves, ankles, and spine",
                "Stretches the groins and inner thighs, chest, and shoulders",
                "Improves sense of balance",
                "Relieves sciatica"
            ],
            "precautions": [
                "Practice near a wall if you are new to balancing poses.",
                "Avoid if you have high blood pressure — do not raise arms overhead."
            ],
            "video_youtube_id": "v7AYKMP6rOE",
        },
        {
            "name": "Paschimottanasana (Seated Forward Bend)",
            "slug": "paschimottanasana",
            "description": "A deep stretch for the entire back of the body — from the soles of the feet to the crown of the head.",
            "category": "flexibility",
            "difficulty": "beginner",
            "duration_minutes": 7,
            "instructions": [
                "Sit on the floor with legs extended straight in front of you.",
                "Flex your feet strongly, pressing through the heels.",
                "Inhale, lengthen the spine upward.",
                "Exhale, hinge forward from the hips (not the waist).",
                "Reach for your feet, shins, or ankles — wherever comfortable.",
                "With each inhale, lengthen the spine; with each exhale, deepen the fold.",
                "Hold for 1–3 minutes."
            ],
            "benefits": [
                "Stretches the spine, shoulders, and hamstrings",
                "Stimulates the liver, kidneys, ovaries, and uterus",
                "Improves digestion",
                "Soothes headaches and anxiety",
                "Relieves menstrual discomfort"
            ],
            "precautions": [
                "Avoid if you have a back injury.",
                "Use a strap around the feet if hamstrings are very tight."
            ],
            "video_youtube_id": "sTANio_2E0Q",
        },
        {
            "name": "Setu Bandha Sarvangasana (Bridge Pose)",
            "slug": "setu-bandha-sarvangasana",
            "description": "A backbend that opens the chest, strengthens the spine and legs, and is accessible to most practitioners.",
            "category": "strength",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Lie on your back with knees bent, feet hip-width apart, flat on the floor.",
                "Place feet about 12 inches from your sitting bones.",
                "Rest arms at your sides, palms down.",
                "Exhale and press feet and arms into the floor.",
                "Lift hips toward the ceiling, clasp hands under your back.",
                "Keep thighs and feet parallel.",
                "Hold for 30 seconds to 1 minute."
            ],
            "benefits": [
                "Stretches chest, neck, spine, and hips",
                "Strengthens back, buttocks, and hamstrings",
                "Improves circulation",
                "Alleviates stress and mild depression",
                "Helps relieve symptoms of menopause"
            ],
            "precautions": [
                "Avoid turning the head while in the pose.",
                "Those with neck injuries should not practice without experienced supervision."
            ],
            "video_youtube_id": "149Iac5fmoE",
        },
        {
            "name": "Savasana (Corpse Pose)",
            "slug": "savasana",
            "description": "The final relaxation pose practiced at the end of every yoga session. Savasana allows the nervous system to integrate the benefits of the practice.",
            "category": "relaxation",
            "difficulty": "beginner",
            "duration_minutes": 10,
            "instructions": [
                "Lie flat on your back with legs extended and slightly apart.",
                "Rest arms at your sides, palms facing up.",
                "Close your eyes and relax completely.",
                "Allow your breath to return to its natural rhythm.",
                "Progressively release tension from each part of the body.",
                "Remain completely still for 5–15 minutes.",
                "To come out, deepen your breath, gently wiggle fingers and toes."
            ],
            "benefits": [
                "Calms the brain and helps relieve stress",
                "Relaxes the body completely",
                "Reduces headache, fatigue, and anxiety",
                "Lowers blood pressure",
                "Helps integrate the benefits of the yoga practice"
            ],
            "precautions": [
                "Pregnant women should lie on their left side with a blanket under the head.",
                "Those with back discomfort can place a bolster under the knees."
            ],
            "video_youtube_id": "g_tea8ZNk5A",
        },
        {
            "name": "Bhujangasana (Cobra Pose)",
            "slug": "bhujangasana-cobra-pose",
            "description": "A gentle backbend that opens the chest, strengthens the spine, and is traditionally said to increase body heat.",
            "category": "strength",
            "difficulty": "beginner",
            "duration_minutes": 5,
            "instructions": [
                "Lie prone on the floor. Stretch legs back, tops of feet on the floor.",
                "Place hands under shoulders, hugging elbows to sides.",
                "Inhale and begin to straighten arms, lifting chest off floor.",
                "Hold the pose for 15–30 seconds breathing easily.",
                "Release back to the floor with an exhalation."
            ],
            "benefits": [
                "Strengthens the spine",
                "Stretches chest, lungs, shoulders, and abdomen",
                "Firms the buttocks",
                "Stimulates abdominal organs",
                "Opens the heart and lungs"
            ],
            "precautions": [
                "Avoid if you have a back injury or are pregnant.",
                "Don't over-straighten — only lift as high as is comfortable."
            ],
            "video_youtube_id": "XeXz8fIZDCE",
        },
        {
            "name": "Trikonasana (Triangle Pose)",
            "slug": "trikonasana-triangle-pose",
            "description": "A foundational standing pose that simultaneously stretches and strengthens the entire body, improving balance and focus.",
            "category": "flexibility",
            "difficulty": "beginner",
            "duration_minutes": 7,
            "instructions": [
                "Stand with feet 3.5 feet apart. Turn right foot out 90°, left in 15°.",
                "Align right heel with the left heel.",
                "Extend arms out to sides at shoulder height.",
                "Extend the torso over the right leg, hinging at the hip.",
                "Rest right hand on the floor, shin, or ankle.",
                "Raise left arm toward the ceiling in line with the right.",
                "Turn head to look up at the left hand (or keep neck neutral).",
                "Hold for 30 seconds to 1 minute. Repeat on the other side."
            ],
            "benefits": [
                "Stretches and strengthens thighs, knees, and ankles",
                "Stretches hips, groins, hamstrings, calves, shoulders, and spine",
                "Stimulates abdominal organs",
                "Improves digestion",
                "Relieves stress"
            ],
            "precautions": [
                "Avoid if you have low blood pressure or a headache.",
                "Those with neck problems should not look up."
            ],
            "video_youtube_id": "sTANio_2E0Q",
        },
    ]
    for y in yoga_data:
        if db.query(YogaExercise).filter(YogaExercise.slug == y["slug"]).first():
            continue
        vid_id = None
        yt_id = y.pop("video_youtube_id", None)
        if yt_id and yt_id in vid_map:
            vid_id = vid_map[yt_id]
        obj = YogaExercise(**y, video_id=vid_id)
        db.add(obj)
    db.commit()
    print(f"  Seeded {len(yoga_data)} yoga exercises")


def seed_practices(vid_map):
    practices = [
        {
            "name": "Nadi Shodhana Pranayama",
            "slug": "nadi-shodhana",
            "category": "pranayama",
            "description": "Alternate nostril breathing is a foundational pranayama technique that balances the left and right hemispheres of the brain and purifies the subtle energy channels (nadis).",
            "traditional_context": "Described in the Hatha Yoga Pradipika and the Gherandasamhita, Nadi Shodhana is considered one of the eight primary pranayama techniques. The practice is said to purify the 72,000 nadis (energy channels) of the subtle body.",
            "traditional_source": "Hatha Yoga Pradipika, Chapter 2; Gherandasamhita; Ministry of AYUSH Yoga Protocol",
            "instructions": [
                "Sit comfortably in Sukhasana or Padmasana, spine erect.",
                "Rest left hand on left knee in Chin Mudra.",
                "Raise right hand to face in Nasika Mudra — thumb over right nostril, ring finger over left.",
                "Close right nostril with thumb. Inhale slowly through the left nostril for 4 counts.",
                "Close both nostrils. Retain the breath for 16 counts (or to your comfort).",
                "Release right nostril. Exhale slowly for 8 counts through the right nostril.",
                "Inhale through the right nostril for 4 counts.",
                "Close both nostrils. Retain for 16 counts.",
                "Release left nostril. Exhale for 8 counts. This completes one cycle.",
                "Practice 5–10 cycles, gradually increasing over weeks of regular practice."
            ],
            "duration_minutes": 10,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Purifies the nadis (subtle energy channels)",
                "Balances solar (Pingala) and lunar (Ida) energies",
                "Prepares the mind for meditation",
                "Calms the nervous system"
            ],
            "modern_understanding": "Research suggests alternate nostril breathing can reduce heart rate, lower blood pressure, and reduce perceived stress. A 2013 study published in the Journal of Clinical and Diagnostic Research found improvements in cardiovascular parameters. Note: these findings are preliminary and should not replace medical treatment.",
            "precautions": [
                "Do not practice if you have a blocked nose or acute respiratory infection.",
                "Consult a qualified yoga teacher before attempting extended breath retention.",
                "Those with hypertension should skip the retention phase initially."
            ],
            "video_youtube_id": "8VwufJrUhic",
        },
        {
            "name": "Kapalabhati Pranayama",
            "slug": "kapalabhati",
            "category": "pranayama",
            "description": "Kapalabhati, often translated as 'skull-shining breath,' is a vigorous pranayama technique involving rapid, forceful exhalations followed by passive inhalations.",
            "traditional_context": "Described in the Hatha Yoga Pradipika as a Shatkarma (one of six cleansing actions), Kapalabhati is traditionally classified as both a pranayama and a kriya (cleansing technique). 'Kapala' means skull; 'bhati' means shining or illuminating.",
            "traditional_source": "Hatha Yoga Pradipika 2.35; Ministry of AYUSH Common Yoga Protocol",
            "instructions": [
                "Sit in Sukhasana with spine erect and hands on knees.",
                "Take a deep breath in.",
                "Exhale sharply through the nose by contracting the abdominal muscles.",
                "The inhalation is passive — simply release the abdomen.",
                "Begin with 1 stroke per second. Gradually increase to 2 per second.",
                "Start with 30 strokes. Rest for 1 minute. Repeat for 3 rounds.",
                "After the last round, retain the breath as long as comfortable."
            ],
            "duration_minutes": 10,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Cleanses the frontal sinuses and respiratory passages",
                "Stimulates and tones abdominal organs",
                "Generates heat and energy (considered to activate Manipura chakra)",
                "Clears mental fog and invigorates the mind"
            ],
            "modern_understanding": "The forceful exhalations can help clear mucus from the airways. The practice activates the sympathetic nervous system, increasing alertness. Note: do not use this as a medical treatment for any respiratory or other condition.",
            "precautions": [
                "Not recommended during pregnancy.",
                "Avoid if you have high blood pressure, epilepsy, hernia, or heart disease.",
                "Those with respiratory conditions should consult a physician first.",
                "Do not practice on a full stomach."
            ],
            "video_youtube_id": "YFUemtBqBFw",
        },
        {
            "name": "Bhramari Pranayama",
            "slug": "bhramari",
            "category": "pranayama",
            "description": "Bhramari, the 'humming bee breath,' involves producing a soft humming sound during exhalation. It is widely used for calming the mind before meditation.",
            "traditional_context": "Named after the black Indian bee (Bhramara), this technique is described in the Hatha Yoga Pradipika. The vibration created by the humming is said to calm the chitta (mind-field) rapidly.",
            "traditional_source": "Hatha Yoga Pradipika 2.68",
            "instructions": [
                "Sit comfortably with spine erect.",
                "Close your eyes and relax the face.",
                "Place index fingers gently over the ear cartilage (Shanmukhi Mudra is optional).",
                "Inhale deeply through the nose.",
                "On the exhalation, make a smooth, steady humming sound like a bee.",
                "Keep the mouth closed. Feel the vibration in the head and face.",
                "Repeat for 5–10 rounds."
            ],
            "duration_minutes": 10,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Immediately calms the mind and nervous system",
                "Traditionally used to relieve anger, anxiety, and grief",
                "Prepares the mind for concentration (dharana) and meditation",
                "Said to improve voice quality"
            ],
            "modern_understanding": "The humming sound increases nitric oxide production in the nasal passages, which may support cardiovascular health and immune function. The practice activates the parasympathetic nervous system, reducing heart rate and stress hormones.",
            "precautions": [
                "Practice in a quiet environment.",
                "Do not practice if you have an ear infection.",
                "If you feel any pain or discomfort, stop immediately."
            ],
            "video_youtube_id": "TmdfNFQNiU0",
        },
        {
            "name": "Trataka (Candle Gazing)",
            "slug": "trataka",
            "category": "meditation",
            "description": "Trataka is a Shatkarma (cleansing practice) involving steady, unblinking gazing at a point or flame to develop concentration and purify the eyes.",
            "traditional_context": "Described in the Hatha Yoga Pradipika as one of the six Shatkarmas, Trataka is also considered a transition between the external limbs of yoga (bahiranga) and the internal limbs (antaranga). It directly trains dharana (concentration).",
            "traditional_source": "Hatha Yoga Pradipika 2.31–2.32; Gherandasamhita 1.53–1.54",
            "instructions": [
                "Place a candle at eye level, about 2 feet from your face, in a darkened room.",
                "Sit comfortably in any meditative posture.",
                "Gaze at the candle flame steadily without blinking.",
                "When tears form or eyes water, gently close the eyes.",
                "Visualize the flame at the centre of your eyebrow (Ajna Chakra).",
                "When the image fades, open your eyes and resume gazing.",
                "Practice for 5–10 minutes, gradually extending over months."
            ],
            "duration_minutes": 10,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Strengthens the eyes and optical nerves",
                "Develops one-pointed concentration (dharana)",
                "Purifies the mind of distractions",
                "Activates the Ajna Chakra (third eye center)"
            ],
            "modern_understanding": "Regular concentration practices have been associated with improved attention and reduced mind-wandering. Trataka's gazing practice can serve as an accessible entry point into meditation for beginners.",
            "precautions": [
                "Those with glaucoma or other eye conditions should avoid this practice.",
                "Epileptic individuals should not practice Trataka with a candle flame.",
                "Never practice staring into the sun."
            ],
            "video_youtube_id": "1vx8iUpMFEA",
        },
        {
            "name": "Yoga Nidra",
            "slug": "yoga-nidra",
            "category": "meditation",
            "description": "Yoga Nidra ('yogic sleep') is a guided relaxation and awareness technique practiced lying down. It induces a state between sleep and waking that facilitates deep rest and self-inquiry.",
            "traditional_context": "Rooted in the Tantric tradition and systematized by Swami Satyananda Saraswati of the Bihar School of Yoga in the 20th century based on ancient Nyasa practices. Used in the Mandukya Upanishad's exploration of consciousness states.",
            "traditional_source": "Bihar School of Yoga; Swami Satyananda Saraswati; influenced by Mandukya Upanishad",
            "instructions": [
                "Lie in Savasana on a mat or bed. Cover yourself with a blanket if needed.",
                "Set a Sankalpa (intention) — a short, positive resolve.",
                "Follow the guide through rotation of awareness across 61 body parts.",
                "Move through pairs of opposite sensations (heavy/light, warm/cool).",
                "Visualize the rapid series of images as directed.",
                "Return to the Sankalpa before slowly being guided back to waking.",
                "Take time to transition slowly. Do not rush to stand."
            ],
            "duration_minutes": 30,
            "difficulty": "beginner",
            "traditional_benefits": [
                "30 minutes of Yoga Nidra is said to provide the rest equivalent to 4 hours of deep sleep",
                "Releases deep-seated samskara (subconscious impressions)",
                "Facilitates reprogramming of the subconscious mind via Sankalpa",
                "Heals the body and mind at a profound level"
            ],
            "modern_understanding": "Research from iRest (Integrative Restoration) protocol — a Yoga Nidra adaptation — has shown reductions in PTSD symptoms, anxiety, and chronic pain. Used by the US Army. Note: these findings are preliminary.",
            "precautions": [
                "You may fall asleep, which is acceptable for beginners.",
                "Practice in a quiet space where you will not be disturbed.",
                "Not a substitute for clinical treatment of PTSD, sleep disorders, or other conditions."
            ],
            "video_youtube_id": "inpok4MKVLM",
        },
        {
            "name": "Dhyana (Meditation)",
            "slug": "dhyana-meditation",
            "category": "meditation",
            "description": "Dhyana is the seventh limb of Patanjali's Ashtanga Yoga — the sustained flow of attention toward an object of meditation. It is distinguished from mere concentration (dharana) by its unbroken quality.",
            "traditional_context": "Defined in the Yoga Sutras of Patanjali (3.2) as 'tatra pratyaya-ekatanata dhyanam' — the uninterrupted flow of the mind toward the object of concentration. Dhyana is the natural culmination of dharana and the gateway to Samadhi.",
            "traditional_source": "Patanjali's Yoga Sutras, Chapter 3; Bhagavad Gita Chapter 6",
            "instructions": [
                "Choose a stable, comfortable seated posture — Sukhasana, Siddhasana, or Padmasana.",
                "Set a timer for your session (start with 10 minutes, increase gradually).",
                "Choose an object of focus — breath, mantra, or a visualized form.",
                "Close the eyes and draw awareness inward.",
                "Direct attention steadily to your chosen object.",
                "When the mind wanders, gently, without self-criticism, return attention.",
                "The gap between wandering and returning becomes the practice itself.",
                "When the timer sounds, sit quietly for one minute before opening the eyes."
            ],
            "duration_minutes": 20,
            "difficulty": "intermediate",
            "traditional_benefits": [
                "Progressively stills the modifications of the mind (chitta vritti nirodha)",
                "Leads toward Samadhi (absorption) and ultimately toward self-knowledge",
                "Cultivates equanimity and non-attachment",
                "Develops clarity and insight (prajna)"
            ],
            "modern_understanding": "Meditation has been extensively studied. Evidence supports benefits for attention, emotional regulation, and stress response. A consistent practice can structurally alter regions of the brain associated with self-referential thought and emotional processing.",
            "precautions": [
                "Those with a history of psychosis or dissociative disorders should practice with clinical guidance.",
                "Meditation can sometimes surface difficult emotions — work with a qualified teacher if needed."
            ],
            "video_youtube_id": "inpok4MKVLM",
        },
        {
            "name": "Dinacharya (Daily Routine)",
            "slug": "dinacharya",
            "category": "lifestyle",
            "description": "Dinacharya describes the ideal daily routine prescribed in Ayurveda, designed to align the individual's biological rhythms with the cycles of nature.",
            "traditional_context": "Described in Ashtanga Hridayam (Sutrasthana 2) and Charaka Samhita, Dinacharya provides a framework for living that maintains dosha balance throughout the day. The timing of practices corresponds to the three-dosha cycle governing different periods of the day.",
            "traditional_source": "Ashtanga Hridayam, Sutrasthana 2; Charaka Samhita, Sutrasthana 5; Ministry of AYUSH",
            "instructions": [
                "Brahma Muhurta (4–6 AM): Rise before sunrise. Moment of clarity and sattvic energy.",
                "Cleansing: Splash cold water on the face. Drink one glass of warm water.",
                "Oral hygiene: Brush teeth, use tongue scraper, practice oil pulling (Gandusa) with sesame oil.",
                "Abhyanga: Self-massage with warm sesame or suitable oil.",
                "Yoga/Pranayama: 30–60 minutes of asana and pranayama.",
                "Meditation: 10–20 minutes of Dhyana.",
                "Bath: Take a warm bath or shower.",
                "Breakfast: Eat according to your prakriti (constitution).",
                "Work: The Pitta period (10 AM–2 PM) is optimal for focused mental work.",
                "Lunch: The main meal, eaten at midday when digestive fire (agni) is strongest.",
                "Evening: Light walk, pranayama, and light dinner at least 2 hours before sleep.",
                "Bedtime: Sleep by 10 PM for optimal ojas (vital essence) restoration."
            ],
            "duration_minutes": 60,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Maintains balance of the three doshas (Vata, Pitta, Kapha)",
                "Strengthens ojas (vital essence) and tejas (radiance)",
                "Aligns body rhythms with natural cycles",
                "Prevents the accumulation of ama (metabolic waste)"
            ],
            "modern_understanding": "Circadian rhythm research confirms that consistent sleep-wake timing, morning light exposure, and meal timing can significantly impact metabolic health, mood, and cognitive function — aligning with many Dinacharya principles.",
            "precautions": [
                "Adapt the routine to your lifestyle — full implementation takes time.",
                "Consult an Ayurvedic practitioner to tailor practices to your constitution.",
                "These are wellness lifestyle guidelines, not medical prescriptions."
            ],
            "video_youtube_id": "1vx8iUpMFEA",
        },
        {
            "name": "Abhyanga (Self-Massage)",
            "slug": "abhyanga-self-massage",
            "category": "lifestyle",
            "description": "Abhyanga is the Ayurvedic practice of self-massage with warm oil, traditionally performed as part of the morning Dinacharya. The word means 'massaging the limbs.'",
            "traditional_context": "Described extensively in Charaka Samhita and Ashtanga Hridayam. Sushruta Samhita states that regular Abhyanga prevents aging, bestows good vision, nourishes the body, prolongs life, induces sleep, and strengthens the skin.",
            "traditional_source": "Ashtanga Hridayam, Sutrasthana 2.8–9; Charaka Samhita, Sutrasthana 5.88–91",
            "instructions": [
                "Choose your oil according to your season: sesame for Vata/winter, coconut for Pitta/summer, mustard for Kapha.",
                "Warm the oil by placing the bottle in hot water for a few minutes.",
                "Begin at the crown of the head, using circular motions.",
                "Move to the face, ears, and neck.",
                "Apply oil to the arms using long strokes on straight parts, circular on joints.",
                "Massage the abdomen and chest in clockwise circular motions.",
                "Move to the back (as best you can reach), then the legs.",
                "Spend extra time on the feet — press the oil into the soles.",
                "Rest with the oil on for 5–20 minutes, then bathe with warm water."
            ],
            "duration_minutes": 20,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Nourishes the dhatus (body tissues)",
                "Pacifies Vata dosha",
                "Improves circulation and skin quality",
                "Promotes deep, restful sleep",
                "Enhances strength and stamina"
            ],
            "modern_understanding": "Regular self-massage can reduce cortisol levels, improve lymphatic circulation, and maintain skin barrier function. The warm oil application supports the nervous system through the skin's sensory receptors.",
            "precautions": [
                "Avoid Abhyanga when you have a fever or acute illness.",
                "Do not apply oil directly to open wounds or skin infections.",
                "Those with oily skin or Kapha constitution should use oil sparingly or use dry brush (Udvartana) instead."
            ],
            "video_youtube_id": "1vx8iUpMFEA",
        },
        {
            "name": "Surya Namaskar (Sun Salutation Practice)",
            "slug": "surya-namaskar-practice",
            "category": "lifestyle",
            "description": "As a traditional wellness practice, Surya Namaskar is performed at sunrise as an act of gratitude and invocation — integrating movement, breath, mantra, and devotion.",
            "traditional_context": "Traditionally performed facing the rising sun with 12 mantras, one per posture, each invoking a solar deity. Documented in various texts including the Aditya Hridayam of the Ramayana and revived systematically by Rajasaheb Bhavanrao Pant Pratinidhi of Aundh in the early 20th century.",
            "traditional_source": "Aditya Hridayam (Valmiki Ramayana); Ministry of AYUSH Common Yoga Protocol",
            "instructions": [
                "Face east toward the rising sun. Stand in Tadasana, hands in prayer.",
                "Position 1 — Pranamasana: Exhale. Prayer position. Mantra: Om Mitraya Namah.",
                "Position 2 — Hasta Uttanasana: Inhale. Raise and stretch arms back. Om Ravaye Namah.",
                "Position 3 — Uttanasana: Exhale. Forward fold. Om Suryaya Namah.",
                "Position 4 — Ashwa Sanchalanasana: Inhale. Right leg back. Om Bhanave Namah.",
                "Position 5 — Adho Mukha Svanasana: Exhale. Left leg back. Both feet together. Om Khagaya Namah.",
                "Position 6 — Ashtanga Namaskara: Retain. Lower knees, chest, forehead. Om Pushne Namah.",
                "Position 7 — Bhujangasana: Inhale. Cobra. Om Hiranya Garbhaya Namah.",
                "Position 8 — Adho Mukha Svanasana: Exhale. Downward Dog. Om Marichaye Namah.",
                "Position 9 — Ashwa Sanchalanasana: Inhale. Right foot forward. Om Adityaya Namah.",
                "Position 10 — Uttanasana: Exhale. Forward fold. Om Savitre Namah.",
                "Position 11 — Hasta Uttanasana: Inhale. Rise and stretch back. Om Arkaya Namah.",
                "Position 12 — Pranamasana: Exhale. Return to prayer. Om Bhaskaraya Namah."
            ],
            "duration_minutes": 15,
            "difficulty": "beginner",
            "traditional_benefits": [
                "Integrates body, breath, mind, and devotion",
                "Activates all 72,000 nadis",
                "Balances all three doshas",
                "Traditionally described as a complete sadhana (spiritual practice) in itself"
            ],
            "modern_understanding": "As a full-body movement sequence synchronized with breath, Surya Namaskar provides cardiovascular, strength, and flexibility benefits. Studies have shown it can improve aerobic capacity and reduce resting heart rate with regular practice.",
            "precautions": [
                "Avoid in cases of wrist, shoulder, or lower back injuries.",
                "Pregnant women should modify or avoid from the second trimester.",
                "Practice on an empty stomach, preferably in the morning."
            ],
            "video_youtube_id": "v7AYKMP6rOE",
        },
    ]
    for p in practices:
        if db.query(AncientPractice).filter(AncientPractice.slug == p["slug"]).first():
            continue
        yt_id = p.pop("video_youtube_id", None)
        vid_id = vid_map.get(yt_id) if yt_id else None
        obj = AncientPractice(**p, video_id=vid_id)
        db.add(obj)
    db.commit()
    print(f"  Seeded {len(practices)} ancient practices")


def seed_gym(vid_map):
    gym_data = [
        {"name": "Push-Up", "slug": "push-up", "muscle_group": "chest", "equipment": "bodyweight", "difficulty": "beginner", "description": "The classic upper body exercise targeting chest, shoulders, and triceps.", "instructions": ["Start in high plank with hands slightly wider than shoulders.", "Lower body until chest almost touches the floor.", "Keep core tight and body in a straight line.", "Push back up to starting position."], "common_mistakes": ["Sagging hips", "Flaring elbows too wide", "Not going to full range of motion"], "default_sets": 3, "default_reps": "10-12", "rest_seconds": 60, "video_youtube_id": "rT7DgCr-3pg"},
        {"name": "Bodyweight Squat", "slug": "bodyweight-squat", "muscle_group": "legs", "equipment": "bodyweight", "difficulty": "beginner", "description": "A fundamental lower body exercise targeting quads, hamstrings, and glutes.", "instructions": ["Stand with feet shoulder-width apart, toes slightly out.", "Brace your core and keep chest up.", "Lower hips down as if sitting into a chair.", "Drive through heels to return to standing."], "common_mistakes": ["Knees caving inward", "Heels lifting off floor", "Rounding the lower back"], "default_sets": 3, "default_reps": "12-15", "rest_seconds": 60, "video_youtube_id": "Dybbiz4TQHQ"},
        {"name": "Pull-Up", "slug": "pull-up", "muscle_group": "back", "equipment": "pull-up bar", "difficulty": "intermediate", "description": "A compound upper-body pulling movement targeting the latissimus dorsi and biceps.", "instructions": ["Hang from bar with overhand grip, hands shoulder-width.", "Engage core and depress shoulder blades.", "Pull elbows down and back to lift chin over bar.", "Lower slowly to full hang."], "common_mistakes": ["Kipping (swinging the body)", "Not reaching full extension at bottom", "Shrugging shoulders"], "default_sets": 3, "default_reps": "6-10", "rest_seconds": 90, "video_youtube_id": "XxWcirHIwVo"},
        {"name": "Plank", "slug": "plank", "muscle_group": "core", "equipment": "bodyweight", "difficulty": "beginner", "description": "An isometric core exercise that strengthens the entire midsection and teaches proper spinal alignment.", "instructions": ["Start in forearm plank position, elbows under shoulders.", "Keep body in a straight line from head to heels.", "Squeeze glutes and engage core strongly.", "Hold position while breathing normally."], "common_mistakes": ["Hips too high or sagging", "Holding breath", "Looking up instead of down"], "default_sets": 3, "default_reps": "30-60 seconds", "rest_seconds": 45, "video_youtube_id": "1ZEnL4_7pBE"},
        {"name": "Deadlift", "slug": "deadlift", "muscle_group": "back", "equipment": "barbell", "difficulty": "intermediate", "description": "The king of compound movements. Targets the entire posterior chain — hamstrings, glutes, lower back, and traps.", "instructions": ["Stand with barbell over mid-foot, feet hip-width.", "Hinge at hips, grip bar just outside legs.", "Brace core, take a deep breath, keep chest tall.", "Drive through the floor, keeping bar close to body.", "Lock out hips at the top. Lower with control."], "common_mistakes": ["Rounding the lower back", "Bar drifting away from body", "Not bracing properly"], "default_sets": 3, "default_reps": "5-8", "rest_seconds": 120, "video_youtube_id": "ykJmrZ5v0Oo"},
        {"name": "Bench Press", "slug": "bench-press", "muscle_group": "chest", "equipment": "barbell", "difficulty": "intermediate", "description": "The primary horizontal pushing movement for chest, anterior deltoid, and triceps development.", "instructions": ["Lie on bench with eyes under bar. Feet flat on floor.", "Grip bar slightly wider than shoulder width.", "Unrack and lower bar to mid-chest with control.", "Press bar back up in a slight arc to starting position."], "common_mistakes": ["Bouncing bar off chest", "Lifting feet off floor", "Flaring elbows 90 degrees"], "default_sets": 3, "default_reps": "8-10", "rest_seconds": 90, "video_youtube_id": "3VcKaXpzqRo"},
        {"name": "Overhead Press", "slug": "overhead-press", "muscle_group": "shoulders", "equipment": "barbell", "difficulty": "intermediate", "description": "A vertical pressing movement for building shoulder strength and stability.", "instructions": ["Stand with barbell at collarbone height, grip shoulder-width.", "Brace core, tuck chin, and press bar directly overhead.", "Bar path moves slightly back at the top around the head.", "Lower with control to starting position."], "common_mistakes": ["Excessive lower back arch", "Bar path too far forward", "Not locking out at top"], "default_sets": 3, "default_reps": "8-10", "rest_seconds": 90, "video_youtube_id": "WvLMauqrnK8"},
        {"name": "Burpee", "slug": "burpee", "muscle_group": "full body", "equipment": "bodyweight", "difficulty": "intermediate", "description": "A full-body cardio exercise combining a squat, push-up, and jump for maximum caloric burn.", "instructions": ["Stand tall. Drop hands to floor and jump feet back to plank.", "Perform a push-up.", "Jump feet back to hands.", "Explosively jump up, arms overhead."], "common_mistakes": ["Skipping the push-up", "Landing with straight legs", "Not fully extending at the jump"], "default_sets": 3, "default_reps": "10", "rest_seconds": 60, "video_youtube_id": "ykJmrZ5v0Oo"},
        {"name": "Lunge", "slug": "lunge", "muscle_group": "legs", "equipment": "bodyweight", "difficulty": "beginner", "description": "A unilateral lower body exercise targeting quads and glutes while improving balance.", "instructions": ["Stand tall, step forward with right foot.", "Lower back knee toward the floor, keeping front shin vertical.", "Push through front heel to return to standing.", "Alternate legs for each rep."], "common_mistakes": ["Front knee caving inward", "Torso leaning too far forward", "Short stride causing knee pain"], "default_sets": 3, "default_reps": "10 each leg", "rest_seconds": 60, "video_youtube_id": "Dybbiz4TQHQ"},
        {"name": "Dumbbell Row", "slug": "dumbbell-row", "muscle_group": "back", "equipment": "dumbbell", "difficulty": "beginner", "description": "A unilateral back exercise that builds lat, rhomboid, and rear deltoid strength.", "instructions": ["Place left knee and hand on a bench for support.", "Hold dumbbell in right hand, arm extended.", "Row the dumbbell to your hip, elbow close to body.", "Lower slowly to full extension."], "common_mistakes": ["Rotating the torso excessively", "Using momentum", "Not fully extending at the bottom"], "default_sets": 3, "default_reps": "10-12 each side", "rest_seconds": 60, "video_youtube_id": "XxWcirHIwVo"},
        {"name": "Mountain Climbers", "slug": "mountain-climbers", "muscle_group": "core", "equipment": "bodyweight", "difficulty": "beginner", "description": "A dynamic core exercise that also elevates heart rate, targeting the abs, hip flexors, and shoulders.", "instructions": ["Start in high plank position.", "Drive right knee toward chest, then return.", "Immediately drive left knee toward chest.", "Continue alternating rapidly while keeping hips level."], "common_mistakes": ["Hips bouncing up", "Rounded lower back", "Hands not directly under shoulders"], "default_sets": 3, "default_reps": "30 seconds", "rest_seconds": 45, "video_youtube_id": "1ZEnL4_7pBE"},
        {"name": "Dips", "slug": "dips", "muscle_group": "chest", "equipment": "dip bars", "difficulty": "intermediate", "description": "A compound pushing exercise targeting the triceps and lower chest.", "instructions": ["Grip parallel bars and press up to starting position.", "Lean slightly forward for chest emphasis.", "Lower body by bending elbows until upper arms are parallel to floor.", "Push back up to full extension."], "common_mistakes": ["Not going to full depth", "Excessive forward lean causing shoulder strain", "Locking elbows too aggressively"], "default_sets": 3, "default_reps": "8-12", "rest_seconds": 75, "video_youtube_id": "rT7DgCr-3pg"},
        {"name": "Romanian Deadlift", "slug": "romanian-deadlift", "muscle_group": "legs", "equipment": "barbell", "difficulty": "intermediate", "description": "A hip-hinge movement that primarily targets the hamstrings and glutes through a large range of motion.", "instructions": ["Stand holding barbell at hip height, overhand grip.", "Hinge at hips, pushing them back as bar travels down the legs.", "Keep back flat and bar close to legs throughout.", "Feel a deep hamstring stretch, then return to standing."], "common_mistakes": ["Bending knees too much (becoming a squat)", "Rounding the back", "Not keeping bar close to legs"], "default_sets": 3, "default_reps": "8-10", "rest_seconds": 90, "video_youtube_id": "ykJmrZ5v0Oo"},
        {"name": "Lateral Raises", "slug": "lateral-raises", "muscle_group": "shoulders", "equipment": "dumbbell", "difficulty": "beginner", "description": "An isolation exercise for the medial (side) deltoid for broader shoulder development.", "instructions": ["Hold dumbbells at sides, slight bend in elbows.", "Raise arms out to sides until parallel with floor.", "Keep a slight forward lean and 'pour the pitcher' at the top.", "Lower slowly — the eccentric is the muscle builder."], "common_mistakes": ["Swinging and using momentum", "Going too heavy", "Shrugging shoulders at the top"], "default_sets": 4, "default_reps": "12-15", "rest_seconds": 45, "video_youtube_id": "WvLMauqrnK8"},
        {"name": "Bicycle Crunches", "slug": "bicycle-crunches", "muscle_group": "core", "equipment": "bodyweight", "difficulty": "beginner", "description": "A core exercise targeting both the rectus abdominis and the obliques through rotation.", "instructions": ["Lie on back, hands behind head, knees bent.", "Lift shoulders and legs slightly off floor.", "Bring right elbow toward left knee while extending right leg.", "Alternate sides in a pedaling motion."], "common_mistakes": ["Pulling on the neck", "Fast, uncontrolled movement", "Not fully rotating the torso"], "default_sets": 3, "default_reps": "20 total", "rest_seconds": 45, "video_youtube_id": "1ZEnL4_7pBE"},
    ]
    for g in gym_data:
        if db.query(GymExercise).filter(GymExercise.slug == g["slug"]).first():
            continue
        yt_id = g.pop("video_youtube_id", None)
        vid_id = vid_map.get(yt_id) if yt_id else None
        obj = GymExercise(**g, video_id=vid_id)
        db.add(obj)
    db.commit()
    print(f"  Seeded {len(gym_data)} gym exercises")


def seed_foods():
    foods = [
        {"name": "Brown Rice", "category": "grains", "description": "Whole grain rice with bran intact. A staple of traditional Indian diets.", "calories_per_100g": 216, "protein_g": 4.5, "carbs_g": 45, "fat_g": 1.8, "traditional_context": "Traditionally consumed in South India, brown rice (unpolished rice) is considered more nourishing than white rice in Ayurveda.", "is_traditional": True},
        {"name": "Moong Dal", "category": "pulses", "description": "Split mung beans. One of the most easily digestible legumes in the Ayurvedic tradition.", "calories_per_100g": 105, "protein_g": 7.0, "carbs_g": 18, "fat_g": 0.4, "traditional_context": "Considered tridoshic (balancing for all three doshas). Moong Dal khichdi is used as a healing food in Ayurvedic panchakarma protocols.", "is_traditional": True},
        {"name": "Bajra (Pearl Millet)", "category": "millets", "description": "A highly nutritious ancient grain rich in iron, magnesium, and fibre.", "calories_per_100g": 378, "protein_g": 11, "carbs_g": 67, "fat_g": 5, "traditional_context": "A traditional winter food in Rajasthan and Gujarat. Bajra roti with ghee is a time-honored winter meal.", "season": "winter", "is_traditional": True},
        {"name": "Ragi (Finger Millet)", "category": "millets", "description": "One of the richest plant sources of calcium. Used in traditional South Indian cuisine.", "calories_per_100g": 336, "protein_g": 7.3, "carbs_g": 72, "fat_g": 1.3, "traditional_context": "Ragi mudde and ragi porridge have been consumed for millennia in Karnataka and Andhra Pradesh. Considered highly nourishing for children and the elderly.", "is_traditional": True},
        {"name": "Chana Dal", "category": "pulses", "description": "Split Bengal gram with a low glycaemic index and high protein content.", "calories_per_100g": 150, "protein_g": 9, "carbs_g": 25, "fat_g": 2.5, "traditional_context": "Used across India in various forms — dal, chutney, and besan (gram flour). Chana is mentioned in Charaka Samhita as a cooling food.", "is_traditional": True},
        {"name": "Turmeric", "category": "spices", "description": "The golden spice of India, containing curcumin with well-documented anti-inflammatory properties.", "calories_per_100g": 312, "protein_g": 9.7, "carbs_g": 67, "fat_g": 3.3, "traditional_context": "Used in Ayurveda for thousands of years as a wound healer, digestive, and complexion enhancer. Turmeric milk (Haldi Doodh) is a traditional Indian remedy.", "is_traditional": True},
        {"name": "Paneer", "category": "dairy", "description": "Fresh Indian cheese that is an excellent source of complete protein and calcium.", "calories_per_100g": 265, "protein_g": 18, "carbs_g": 1.2, "fat_g": 21, "traditional_context": "A cornerstone of vegetarian Indian cuisine. Prepared fresh from cow or buffalo milk.", "is_traditional": True},
        {"name": "Amla (Indian Gooseberry)", "category": "fruits", "description": "One of the richest natural sources of Vitamin C. A central ingredient in Triphala and Chyawanprash.", "calories_per_100g": 44, "protein_g": 0.9, "carbs_g": 10, "fat_g": 0.1, "traditional_context": "Considered a Rasayana (rejuvenative) herb in Ayurveda. Amla is said to balance all three doshas.", "is_traditional": True},
        {"name": "Ghee", "category": "dairy", "description": "Clarified butter — a cornerstone of Ayurvedic cooking and ritual. Rich in butyrate and fat-soluble vitamins.", "calories_per_100g": 900, "protein_g": 0, "carbs_g": 0, "fat_g": 99, "traditional_context": "Used in cooking, medicine, and fire rituals. Ayurveda considers ghee the finest cooking fat, capable of carrying herb properties deep into the tissues (dhatus).", "is_traditional": True},
        {"name": "Quinoa", "category": "grains", "description": "A complete protein grain alternative high in all essential amino acids.", "calories_per_100g": 222, "protein_g": 8, "carbs_g": 39, "fat_g": 4, "traditional_context": None, "is_traditional": False},
        {"name": "Chicken Breast", "category": "proteins", "description": "Lean poultry protein. The most popular protein source for muscle gain.", "calories_per_100g": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6, "traditional_context": None, "is_traditional": False},
        {"name": "Almonds", "category": "nuts", "description": "Nutrient-dense nuts rich in healthy fats, vitamin E, and magnesium.", "calories_per_100g": 579, "protein_g": 21, "carbs_g": 22, "fat_g": 49, "traditional_context": "Soaked almonds are a traditional Indian morning practice, believed to improve memory and brain function.", "is_traditional": True},
    ]
    for f in foods:
        if not db.query(Food).filter(Food.name == f["name"]).first():
            db.add(Food(**f))
    db.commit()
    print(f"  Seeded {len(foods)} foods")


def seed_diet_plans():
    plans = [
        {
            "name": "Traditional Sattvic Diet — General Wellness",
            "goal": "general_fitness",
            "diet_type": "vegetarian",
            "is_traditional": True,
            "estimated_calories": 1800,
            "meals": {
                "morning_ritual": {"time": "6:00 AM", "items": ["Warm water with lemon", "5 soaked almonds"]},
                "breakfast": {"time": "8:00 AM", "items": ["Ragi porridge with jaggery and cardamom", "Fresh fruit (seasonal)", "Herbal tea (tulsi, ginger)"], "approx_calories": 400},
                "lunch": {"time": "12:30 PM", "items": ["Brown rice (1 cup)", "Moong dal (1 cup)", "Seasonal sabzi (cooked vegetables)", "Salad with lemon dressing", "A spoon of ghee"], "approx_calories": 650},
                "evening": {"time": "4:00 PM", "items": ["Herbal tea", "A handful of roasted chana or fruit"]},
                "dinner": {"time": "7:00 PM", "items": ["Bajra or roti (2)", "Dal or sabzi", "Buttermilk (chaas)"], "approx_calories": 550},
            },
        },
        {
            "name": "High Protein Muscle Gain Plan — Vegetarian",
            "goal": "muscle_gain",
            "diet_type": "vegetarian",
            "is_traditional": False,
            "estimated_calories": 2500,
            "meals": {
                "breakfast": {"time": "8:00 AM", "items": ["Oats with protein powder", "3 whole eggs or paneer bhurji", "1 banana", "Milk"], "approx_calories": 700, "protein_g": 40},
                "mid_morning": {"time": "11:00 AM", "items": ["Greek yoghurt with berries", "Almonds"]},
                "lunch": {"time": "1:00 PM", "items": ["Rice (1.5 cups)", "Chana dal (1 cup)", "Paneer (100g)", "Vegetables"], "approx_calories": 800, "protein_g": 45},
                "pre_workout": {"time": "4:00 PM", "items": ["Banana", "Coffee or green tea"]},
                "dinner": {"time": "8:00 PM", "items": ["Roti (3)", "Rajma or chole (1 cup)", "Salad", "Milk (1 glass)"], "approx_calories": 750, "protein_g": 35},
            },
        },
        {
            "name": "Weight Loss Plan — Non-Vegetarian",
            "goal": "weight_loss",
            "diet_type": "non_vegetarian",
            "is_traditional": False,
            "estimated_calories": 1500,
            "meals": {
                "breakfast": {"time": "8:00 AM", "items": ["2 egg whites + 1 whole egg (scrambled)", "Multigrain toast", "Green tea"], "approx_calories": 300, "protein_g": 25},
                "lunch": {"time": "1:00 PM", "items": ["Grilled chicken breast (150g)", "Quinoa or brown rice (0.5 cup)", "Salad with olive oil"], "approx_calories": 500, "protein_g": 40},
                "snack": {"time": "4:00 PM", "items": ["Roasted chana", "Buttermilk"]},
                "dinner": {"time": "7:00 PM", "items": ["Fish (grilled, 150g)", "Stir-fried vegetables", "1 roti or no grain"], "approx_calories": 450, "protein_g": 38},
            },
        },
    ]
    for p in plans:
        if not db.query(DietPlan).filter(DietPlan.name == p["name"]).first():
            db.add(DietPlan(**p))
    db.commit()
    print(f"  Seeded {len(plans)} diet plans")


def seed_admin_user():
    if not db.query(User).filter(User.email == "admin@yogkriya.com").first():
        user = User(
            name="YogKriya Admin",
            email="admin@yogkriya.com",
            password_hash=hash_password("admin123"),
            is_admin=True,
        )
        db.add(user)
        db.flush()
        db.add(UserProfile(user_id=user.id, onboarding_completed=True))
        db.commit()
        print("  Created admin user: admin@yogkriya.com / admin123")


if __name__ == "__main__":
    print("🌱 Seeding YogKriya database...")
    vid_map = seed_videos()
    print(f"  Seeded {len(vid_map)} videos")
    seed_yoga(vid_map)
    seed_practices(vid_map)
    seed_gym(vid_map)
    seed_foods()
    seed_diet_plans()
    seed_admin_user()
    print("✅ Seeding complete!")
    db.close()
