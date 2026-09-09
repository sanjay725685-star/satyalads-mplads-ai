"""
SATYALADS - Synthetic Dataset Generator
Smart India Hackathon 2026 (Problem Statement 26102)
Team: Stack Attack

Generates 320+ realistic MPLAD project records across real Indian Lok Sabha constituencies.
Seeded fraud patterns:
1. Contractor Cartels (shared PAN/GSTIN/address/phone)
2. Spatial Duplicates & Double Funding (DBSCAN cluster + text similarity + overlapping dates)
3. Cost / Overpricing Anomalies (z-score > 2.0 / IQR outliers)
4. Ghost Projects & Photo Reuse (identical perceptual image hashes)
5. Geotag Discrepancies (embedded EXIF GPS mismatch > 500m, missing EXIF, timestamp anomalies)
"""

import os
import json
import sqlite3
import random
import math
import datetime
from typing import List, Dict, Any
from PIL import Image
import piexif

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
PHOTOS_DIR = os.path.join(DATA_DIR, 'site_photos')
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PHOTOS_DIR, exist_ok=True)

# 25 Real Indian Lok Sabha Constituencies with accurate GPS coordinates
CONSTITUENCIES = [
    {"id": "VARANASI", "name": "Varanasi", "state": "Uttar Pradesh", "district": "Varanasi", "mp": "Narendra Modi", "party": "BJP", "lat": 25.3176, "lng": 82.9739},
    {"id": "WAYANAD", "name": "Wayanad", "state": "Kerala", "district": "Wayanad", "mp": "Priyanka Gandhi Vadra", "party": "INC", "lat": 11.6854, "lng": 76.1320},
    {"id": "BLR_SOUTH", "name": "Bangalore South", "state": "Karnataka", "district": "Bengaluru Urban", "mp": "Tejasvi Surya", "party": "BJP", "lat": 12.9249, "lng": 77.5878},
    {"id": "BARAMATI", "name": "Baramati", "state": "Maharashtra", "district": "Pune", "mp": "Supriya Sule", "party": "NCP-SP", "lat": 18.1516, "lng": 74.5772},
    {"id": "PATNA_SAHIB", "name": "Patna Sahib", "state": "Bihar", "district": "Patna", "mp": "Ravi Shankar Prasad", "party": "BJP", "lat": 25.5941, "lng": 85.2139},
    {"id": "NEW_DELHI", "name": "New Delhi", "state": "Delhi (NCT)", "district": "New Delhi", "mp": "Bansuri Swaraj", "party": "BJP", "lat": 28.6139, "lng": 77.2090},
    {"id": "GANDHINAGAR", "name": "Gandhinagar", "state": "Gujarat", "district": "Gandhinagar", "mp": "Amit Shah", "party": "BJP", "lat": 23.2156, "lng": 72.6369},
    {"id": "HYDERABAD", "name": "Hyderabad", "state": "Telangana", "district": "Hyderabad", "mp": "Asaduddin Owaisi", "party": "AIMIM", "lat": 17.3850, "lng": 78.4867},
    {"id": "KOLKATA_NORTH", "name": "Kolkata North", "state": "West Bengal", "district": "Kolkata", "mp": "Sudip Bandyopadhyay", "party": "AITC", "lat": 22.5726, "lng": 88.3639},
    {"id": "JAIPUR", "name": "Jaipur", "state": "Rajasthan", "district": "Jaipur", "mp": "Manju Sharma", "party": "BJP", "lat": 26.9124, "lng": 75.7873},
    {"id": "BHOPAL", "name": "Bhopal", "state": "Madhya Pradesh", "district": "Bhopal", "mp": "Alok Sharma", "party": "BJP", "lat": 23.2599, "lng": 77.4126},
    {"id": "GUWAHATI", "name": "Guwahati", "state": "Assam", "district": "Kamrup Metro", "mp": "Bijuli Kalita Medhi", "party": "BJP", "lat": 26.1445, "lng": 91.7362},
    {"id": "SRINAGAR", "name": "Srinagar", "state": "Jammu & Kashmir", "district": "Srinagar", "mp": "Aga Syed Ruhullah Mehdi", "party": "JKNC", "lat": 34.0837, "lng": 74.7973},
    {"id": "LUCKNOW", "name": "Lucknow", "state": "Uttar Pradesh", "district": "Lucknow", "mp": "Rajnath Singh", "party": "BJP", "lat": 26.8467, "lng": 80.9462},
    {"id": "MUMBAI_SOUTH", "name": "Mumbai South", "state": "Maharashtra", "district": "Mumbai City", "mp": "Arvind Sawant", "party": "SS-UBT", "lat": 18.9388, "lng": 72.8354},
    {"id": "AHMEDABAD_EAST", "name": "Ahmedabad East", "state": "Gujarat", "district": "Ahmedabad", "mp": "Hasmukh Patel", "party": "BJP", "lat": 23.0225, "lng": 72.5714},
    {"id": "INDORE", "name": "Indore", "state": "Madhya Pradesh", "district": "Indore", "mp": "Shankar Lalwani", "party": "BJP", "lat": 22.7196, "lng": 75.8577},
    {"id": "THIRUVANANTHAPURAM", "name": "Thiruvananthapuram", "state": "Kerala", "district": "Thiruvananthapuram", "mp": "Shashi Tharoor", "party": "INC", "lat": 8.5241, "lng": 76.9366},
    {"id": "MYSORE", "name": "Mysore", "state": "Karnataka", "district": "Mysuru", "mp": "Yaduveer Wadiyar", "party": "BJP", "lat": 12.2958, "lng": 76.6394},
    {"id": "SECUNDERABAD", "name": "Secunderabad", "state": "Telangana", "district": "Hyderabad", "mp": "G. Kishan Reddy", "party": "BJP", "lat": 17.4399, "lng": 78.4983},
    {"id": "JODHPUR", "name": "Jodhpur", "state": "Rajasthan", "district": "Jodhpur", "mp": "Gajendra Singh Shekhawat", "party": "BJP", "lat": 26.2389, "lng": 73.0243},
    {"id": "GORAKHPUR", "name": "Gorakhpur", "state": "Uttar Pradesh", "district": "Gorakhpur", "mp": "Ravi Kishan", "party": "BJP", "lat": 26.7606, "lng": 83.3732},
    {"id": "NALANDA", "name": "Nalanda", "state": "Bihar", "district": "Nalanda", "mp": "Kaushlendra Kumar", "party": "JD(U)", "lat": 25.1357, "lng": 85.4526},
    {"id": "DARJEELING", "name": "Darjeeling", "state": "West Bengal", "district": "Darjeeling", "mp": "Raju Bista", "party": "BJP", "lat": 27.0410, "lng": 88.2663},
    {"id": "JAMMU", "name": "Jammu", "state": "Jammu & Kashmir", "district": "Jammu", "mp": "Jugal Kishore Sharma", "party": "BJP", "lat": 32.7266, "lng": 74.8570}
]

# Project Categories with baseline PWD Schedule of Rates (Cost in Lakhs INR)
CATEGORIES = [
    {
        "category": "Road Construction",
        "median_cost": 45.0,
        "std_cost": 12.0,
        "min_cost": 22.0,
        "max_cost": 75.0,
        "templates": [
            "Construction of CC Road from {loc1} to {loc2}",
            "Upgradation of Bituminous Road connecting {loc1} and {loc2}",
            "Interlocking Paver Block Road installation at {loc1} Ward {num}",
            "Widening and resurfacing of rural link road near {loc1}"
        ]
    },
    {
        "category": "Community Building",
        "median_cost": 65.0,
        "std_cost": 18.0,
        "min_cost": 35.0,
        "max_cost": 110.0,
        "templates": [
            "Construction of Multi-purpose Community Hall at {loc1}",
            "Development of Anganwadi Kendra and Balwadi Center at {loc1}",
            "Construction of Senior Citizen Recreational Facility in {loc1}",
            "Erection of Village Panchayat Bhavan Extension at {loc1}"
        ]
    },
    {
        "category": "Water Supply & Drainage",
        "median_cost": 32.0,
        "std_cost": 9.0,
        "min_cost": 15.0,
        "max_cost": 55.0,
        "templates": [
            "Installation of Solar-Powered Deep Tube Well & Overhead Tank at {loc1}",
            "Laying of Underground Covered Drainage Network along {loc1} Main Road",
            "Establishment of Community RO Drinking Water Plant at {loc1}",
            "Rainwater Harvesting and Recharging Well at {loc1} Government Campus"
        ]
    },
    {
        "category": "Solar & Electrical",
        "median_cost": 22.0,
        "std_cost": 6.0,
        "min_cost": 10.0,
        "max_cost": 40.0,
        "templates": [
            "Installation of 60 High-Mast Solar LED Street Lights across {loc1}",
            "Rooftop Solar PV Microgrid (15kW) at Primary Health Centre, {loc1}",
            "Electrification & Transformer Upgradation for Agricultural Pump Feeder in {loc1}",
            "Solar Powered Public Illumination System at {loc1} Market Junction"
        ]
    },
    {
        "category": "Sanitation & Waste",
        "median_cost": 18.0,
        "std_cost": 5.0,
        "min_cost": 8.0,
        "max_cost": 32.0,
        "templates": [
            "Construction of Modern Public Toilet Complex with Septic Bio-Digester at {loc1}",
            "Solid Waste Segregation Shed & Vermi-Compost Facility at {loc1}",
            "Installation of Mobile Sanitation Block for Rural Haat at {loc1}",
            "Community Soak Pit and Greywater Treatment Unit at {loc1}"
        ]
    },
    {
        "category": "Education Infrastructure",
        "median_cost": 52.0,
        "std_cost": 14.0,
        "min_cost": 28.0,
        "max_cost": 90.0,
        "templates": [
            "Construction of 3 Additional Smart Classrooms at Govt High School {loc1}",
            "Establishment of STEM Robotics Lab and Science Library at {loc1}",
            "Renovation and Construction of Girls Hostel Wing at {loc1}",
            "Composite Digital Library & Skill Development Center at {loc1}"
        ]
    }
]

# Deliberately Seeded Contractor Cartels
CARTEL_1 = [
    {"name": "Kashi Infratech Pvt Ltd", "pan": "AABCV9921K", "gstin": "09AABCV9921K1Z3", "phone": "+91 94150 23891", "address": "B-12 Sigra Commercial Complex, Varanasi", "city": "Varanasi"},
    {"name": "Ganga Valley Buildcon LLP", "pan": "AABCV9921K", "gstin": "09AABCV9921K2Z4", "phone": "+91 94150 23891", "address": "B-12 Sigra Commercial Complex, Varanasi", "city": "Varanasi"},
    {"name": "Purvanchal Civil Engineering Works", "pan": "AABCV9921K", "gstin": "09AABCV9921K3Z5", "phone": "+91 94150 23891", "address": "B-14 Sigra Commercial Complex, Varanasi", "city": "Varanasi"}
]

CARTEL_2 = [
    {"name": "Deccan Engineering Consortium", "pan": "AACPD4412M", "gstin": "29AACPD4412M1Z2", "phone": "+91 98450 11928", "address": "42 Indiranagar 100ft Rd, Bangalore", "city": "Bangalore"},
    {"name": "Apex South Infra Projects", "pan": "BCRPD4412Q", "gstin": "29AACPD4412M1Z2", "phone": "+91 98450 11929", "address": "42 Indiranagar 100ft Rd, Bangalore", "city": "Bangalore"},
    {"name": "Kaveri Urban Developers", "pan": "DFRPD4412X", "gstin": "29AACPD4412M1Z2", "phone": "+91 98450 11928", "address": "42 Indiranagar 100ft Rd, Bangalore", "city": "Bangalore"}
]

CARTEL_3 = [
    {"name": "Magadh Roadlines & Constructions", "pan": "ABCPR8812D", "gstin": "10ABCPR8812D1Z1", "phone": "+91 94310 55421", "address": "7 Dak Bunglow Rd, Patna", "city": "Patna"},
    {"name": "Pataliputra Heavy Builders", "pan": "ABCPR8812D", "gstin": "10ABCPR8812D2Z2", "phone": "+91 94310 55421", "address": "7 Dak Bunglow Rd, Patna", "city": "Patna"},
    {"name": "Bihar Vikas Engineering Co", "pan": "ABCPR8812D", "gstin": "10ABCPR8812D3Z3", "phone": "+91 94310 55422", "address": "7 Dak Bunglow Rd, Patna", "city": "Patna"}
]

CARTEL_4 = [
    {"name": "Thar Civil Infra Projects", "pan": "AAJPT3321N", "gstin": "08AAJPT3321N1ZA", "phone": "+91 98290 88712", "address": "15 MI Road, Pink City Center, Jaipur", "city": "Jaipur"},
    {"name": "Marwar Earthmovers & Bitumen Ltd", "pan": "BAJPT3321P", "gstin": "08BAJPT3321P1ZB", "phone": "+91 98290 88712", "address": "15 MI Road, Pink City Center, Jaipur", "city": "Jaipur"},
    {"name": "Pink City Infracon Ltd", "pan": "CAJPT3321R", "gstin": "08CAJPT3321R1ZC", "phone": "+91 98290 88712", "address": "15 MI Road, Pink City Center, Jaipur", "city": "Jaipur"}
]

INDEPENDENT_CONTRACTORS = [
    {"name": "Shree Balaji Constructions", "pan": "ABCDE1234F", "gstin": "09ABCDE1234F1Z1", "phone": "+91 98390 12345", "address": "Plot 44, Industrial Area, Kanpur", "city": "Kanpur"},
    {"name": "Southern Bharat Builders", "pan": "BCDEF2345G", "gstin": "32BCDEF2345G1Z2", "phone": "+91 94470 23456", "address": "Main Road, Kalpetta, Wayanad", "city": "Wayanad"},
    {"name": "Western Ghats Infra Solutions", "pan": "CDEFG3456H", "gstin": "27CDEFG3456H1Z3", "phone": "+91 98220 34567", "address": "Station Rd, Baramati", "city": "Baramati"},
    {"name": "Gujarat Vikas Engineering Ltd", "pan": "DEFGH4567I", "gstin": "24DEFGH4567I1Z4", "phone": "+91 98250 45678", "address": "Sector 11, Gandhinagar", "city": "Gandhinagar"},
    {"name": "Telangana Smart Infrastructure", "pan": "EFGHI5678J", "gstin": "36EFGHI5678J1Z5", "phone": "+91 98480 56789", "address": "Abids Commercial Square, Hyderabad", "city": "Hyderabad"},
    {"name": "Bengal Rural Works Consortium", "pan": "FGHIJ6789K", "gstin": "19FGHIJ6789K1Z6", "phone": "+91 98300 67890", "address": "Shyambazar, Kolkata", "city": "Kolkata"},
    {"name": "Central India Concrete Works", "pan": "GHIJK7890L", "gstin": "23GHIJK7890L1Z7", "phone": "+91 94250 78901", "address": "MP Nagar, Bhopal", "city": "Bhopal"},
    {"name": "Brahmaputra Engineering Works", "pan": "HIJKL8901M", "gstin": "18HIJKL8901M1Z8", "phone": "+91 94350 89012", "address": "GS Road, Guwahati", "city": "Guwahati"},
    {"name": "Chinar Valley Buildtech", "pan": "IJKLM9012N", "gstin": "01IJKLM9012N1Z9", "phone": "+91 94190 90123", "address": "Lal Chowk, Srinagar", "city": "Srinagar"},
    {"name": "National Capital Infra Corp", "pan": "JKLMN0123O", "gstin": "07JKLMN0123O1Z0", "phone": "+91 98110 01234", "address": "Connaught Place, New Delhi", "city": "New Delhi"}
]

LOCALITIES = [
    "Rohania", "Shivpur", "Ramnagar", "Kashi", "Sarnath", "Pandav Nagar", "Kalpetta",
    "Mananthavady", "Sulthan Bathery", "Jayanagar", "Basavanagudi", "JP Nagar",
    "Bhigwan", "Malegaon", "Someshwar", "Kankarbagh", "Rajendra Nagar", "Danapur",
    "Chanakyapuri", "Lodhi Colony", "Palam", "Koba", "Randesan", "Infocity",
    "Charminar", "Faluknuma", "Mehdipatnam", "Shyambazar", "Bagbazar", "Maniktala",
    "Mansarovar", "Malviya Nagar", "Sanganer", "Arera Colony", "Kolar", "Govindpura",
    "Dispur", "Jalukbari", "Beltola", "Dalgate", "Rajbagh", "Hazratbal"
]

def to_dms_rational(deg_float: float):
    deg = int(abs(deg_float))
    rem = (abs(deg_float) - deg) * 60
    minute = int(rem)
    sec = int((rem - minute) * 60 * 100)
    return ((deg, 1), (minute, 1), (sec, 100))

from PIL import ImageDraw

def generate_exif_image(file_path: str, lat: float, lng: float, capture_datetime: datetime.datetime, is_stripped: bool = False, pattern_seed: int = 0):
    colors = [(45, 95, 145), (34, 139, 34), (178, 34, 34), (218, 165, 32), (70, 130, 180), (106, 90, 205)]
    bg_color = colors[pattern_seed % len(colors)]
    img = Image.new("RGB", (640, 480), color=bg_color)
    
    # Draw unique geometric patterns so each non-ghost image has distinct pHash
    draw = ImageDraw.Draw(img)
    p_rnd = random.Random(pattern_seed)
    for _ in range(8):
        x1 = p_rnd.randint(10, 500)
        y1 = p_rnd.randint(10, 400)
        x2 = x1 + p_rnd.randint(40, 120)
        y2 = y1 + p_rnd.randint(40, 120)
        f_color = (p_rnd.randint(0, 255), p_rnd.randint(0, 255), p_rnd.randint(0, 255))
        draw.rectangle([x1, y1, x2, y2], fill=f_color)
        
    if is_stripped:
        img.save(file_path, "JPEG")
        return

    lat_ref = "N" if lat >= 0 else "S"
    lng_ref = "E" if lng >= 0 else "W"

    gps_ifd = {
        piexif.GPSIFD.GPSLatitudeRef: lat_ref,
        piexif.GPSIFD.GPSLatitude: to_dms_rational(lat),
        piexif.GPSIFD.GPSLongitudeRef: lng_ref,
        piexif.GPSIFD.GPSLongitude: to_dms_rational(lng),
        piexif.GPSIFD.GPSAltitudeRef: 0,
        piexif.GPSIFD.GPSAltitude: (int(random.uniform(50, 450) * 10), 10)
    }

    dt_str = capture_datetime.strftime("%Y:%m:%d %H:%M:%S")
    exif_ifd = {
        piexif.ExifIFD.DateTimeOriginal: dt_str,
        piexif.ExifIFD.DateTimeDigitized: dt_str
    }

    zeroth_ifd = {
        piexif.ImageIFD.Make: "NIC-GovGeoCapture",
        piexif.ImageIFD.Model: "SatyaLADS Field Sentinel v2.4",
        piexif.ImageIFD.DateTime: dt_str
    }

    exif_bytes = piexif.dump({"0th": zeroth_ifd, "Exif": exif_ifd, "GPS": gps_ifd})
    img.save(file_path, "JPEG", exif=exif_bytes)

def generate_dataset(total_records: int = 320) -> List[Dict[str, Any]]:
    print(f"[*] Generating {total_records} realistic MPLAD project records...")
    random.seed(2026)
    records: List[Dict[str, Any]] = []

    cartel_contractors = CARTEL_1 + CARTEL_2 + CARTEL_3 + CARTEL_4
    all_contractors = cartel_contractors + INDEPENDENT_CONTRACTORS

    base_date = datetime.date(2024, 4, 1)

    ghost_image_files = []
    for g in range(8):
        g_name = f"ghost_sample_{g+1}.jpg"
        g_path = os.path.join(PHOTOS_DIR, g_name)
        generate_exif_image(g_path, 25.3176, 82.9739, datetime.datetime(2024, 7, 15, 11, 30), pattern_seed=9999 + g)
        ghost_image_files.append(f"/site_photos/{g_name}")

    work_seq = 1

    # PHASE 1: Seed Contractor Cartels (~30 projects awarded to cartel nodes)
    print(" -> Seeding contractor cartel bids (Ring 1-4)...")
    cartel_groups = [CARTEL_1, CARTEL_2, CARTEL_3, CARTEL_4]
    for c_idx, cartel in enumerate(cartel_groups):
        c_const = CONSTITUENCIES[c_idx % len(CONSTITUENCIES)]
        for firm in cartel:
            for _ in range(2):
                cat = random.choice(CATEGORIES)
                loc1 = random.choice(LOCALITIES)
                loc2 = random.choice(LOCALITIES)
                num = random.randint(1, 25)
                title = random.choice(cat["templates"]).format(loc1=loc1, loc2=loc2, num=num)
                
                cost = round(random.gauss(cat["median_cost"], cat["std_cost"] * 0.5), 2)
                cost = max(cat["min_cost"], min(cost, cat["max_cost"]))

                offset_lat = random.uniform(-0.04, 0.04)
                offset_lng = random.uniform(-0.04, 0.04)
                p_lat = round(c_const["lat"] + offset_lat, 5)
                p_lng = round(c_const["lng"] + offset_lng, 5)

                day_offset = random.randint(10, 300)
                s_date = base_date + datetime.timedelta(days=day_offset)
                c_date = s_date + datetime.timedelta(days=random.randint(120, 280))

                img_name = f"project_{work_seq:04d}.jpg"
                img_path = os.path.join(PHOTOS_DIR, img_name)
                generate_exif_image(img_path, p_lat + random.uniform(-0.0002, 0.0002), p_lng + random.uniform(-0.0002, 0.0002), datetime.datetime.combine(s_date, datetime.time(10, 30)), pattern_seed=work_seq)

                records.append({
                    "id": f"MPLADS-2024-25-{c_const['id']}-{work_seq:04d}",
                    "work_code": f"{c_const['id']}-W{work_seq:04d}",
                    "title": title,
                    "category": cat["category"],
                    "constituency_id": c_const["id"],
                    "constituency_name": c_const["name"],
                    "state": c_const["state"],
                    "district": c_const["district"],
                    "mp_name": c_const["mp"],
                    "sanctioned_cost_lakhs": cost,
                    "expenditure_lakhs": round(cost * random.uniform(0.6, 0.95), 2),
                    "latitude": p_lat,
                    "longitude": p_lng,
                    "sanction_date": s_date.isoformat(),
                    "target_completion_date": c_date.isoformat(),
                    "contractor_name": firm["name"],
                    "contractor_pan": firm["pan"],
                    "contractor_gstin": firm["gstin"],
                    "contractor_phone": firm["phone"],
                    "contractor_address": firm["address"],
                    "site_photo_url": f"/site_photos/{img_name}",
                    "photo_exif_lat": round(p_lat + 0.00015, 5),
                    "photo_exif_lng": round(p_lng + 0.00015, 5),
                    "photo_exif_timestamp": s_date.isoformat() + "T10:30:00",
                    "workflow_status": "FLAGGED",
                    "seed_type": "CARTEL_NODE"
                })
                work_seq += 1

    # PHASE 2: Seed Spatial Duplicates & Double Funding (~30 projects in 15 pairs)
    print(" -> Seeding spatial duplicate / double-funding pairs (DBSCAN target)...")
    for pair_idx in range(15):
        const = CONSTITUENCIES[pair_idx % len(CONSTITUENCIES)]
        cat = CATEGORIES[pair_idx % len(CATEGORIES)]
        loc_base = random.choice(LOCALITIES)

        base_lat = round(const["lat"] + random.uniform(-0.03, 0.03), 5)
        base_lng = round(const["lng"] + random.uniform(-0.03, 0.03), 5)

        s_date1 = base_date + datetime.timedelta(days=random.randint(15, 180))
        s_date2 = s_date1 + datetime.timedelta(days=random.randint(10, 45))

        cost1 = round(random.gauss(cat["median_cost"], cat["std_cost"] * 0.4), 2)
        cost2 = round(random.gauss(cat["median_cost"], cat["std_cost"] * 0.4), 2)

        firm1 = random.choice(INDEPENDENT_CONTRACTORS)
        firm2 = random.choice(INDEPENDENT_CONTRACTORS)

        img_name_a = f"project_{work_seq:04d}.jpg"
        img_path_a = os.path.join(PHOTOS_DIR, img_name_a)
        generate_exif_image(img_path_a, base_lat, base_lng, datetime.datetime.combine(s_date1, datetime.time(11, 0)), pattern_seed=work_seq)

        records.append({
            "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
            "work_code": f"{const['id']}-W{work_seq:04d}",
            "title": f"Construction of {cat['category']} at {loc_base} Main Sector Road",
            "category": cat["category"],
            "constituency_id": const["id"],
            "constituency_name": const["name"],
            "state": const["state"],
            "district": const["district"],
            "mp_name": const["mp"],
            "sanctioned_cost_lakhs": cost1,
            "expenditure_lakhs": round(cost1 * 0.85, 2),
            "latitude": base_lat,
            "longitude": base_lng,
            "sanction_date": s_date1.isoformat(),
            "target_completion_date": (s_date1 + datetime.timedelta(days=180)).isoformat(),
            "contractor_name": firm1["name"],
            "contractor_pan": firm1["pan"],
            "contractor_gstin": firm1["gstin"],
            "contractor_phone": firm1["phone"],
            "contractor_address": firm1["address"],
            "site_photo_url": f"/site_photos/{img_name_a}",
            "photo_exif_lat": base_lat + 0.0001,
            "photo_exif_lng": base_lng + 0.0001,
            "photo_exif_timestamp": s_date1.isoformat() + "T11:00:00",
            "workflow_status": "FLAGGED",
            "seed_type": "DOUBLE_FUNDING_PAIR_A"
        })
        work_seq += 1

        img_name_b = f"project_{work_seq:04d}.jpg"
        img_path_b = os.path.join(PHOTOS_DIR, img_name_b)
        generate_exif_image(img_path_b, base_lat + 0.0003, base_lng + 0.0002, datetime.datetime.combine(s_date2, datetime.time(14, 0)), pattern_seed=work_seq)

        records.append({
            "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
            "work_code": f"{const['id']}-W{work_seq:04d}",
            "title": f"Upgradation and development of {cat['category']} near {loc_base} Sector Main Road",
            "category": cat["category"],
            "constituency_id": const["id"],
            "constituency_name": const["name"],
            "state": const["state"],
            "district": const["district"],
            "mp_name": const["mp"],
            "sanctioned_cost_lakhs": cost2,
            "expenditure_lakhs": round(cost2 * 0.90, 2),
            "latitude": round(base_lat + 0.0003, 5),
            "longitude": round(base_lng + 0.0002, 5),
            "sanction_date": s_date2.isoformat(),
            "target_completion_date": (s_date2 + datetime.timedelta(days=180)).isoformat(),
            "contractor_name": firm2["name"],
            "contractor_pan": firm2["pan"],
            "contractor_gstin": firm2["gstin"],
            "contractor_phone": firm2["phone"],
            "contractor_address": firm2["address"],
            "site_photo_url": f"/site_photos/{img_name_b}",
            "photo_exif_lat": round(base_lat + 0.00035, 5),
            "photo_exif_lng": round(base_lng + 0.00025, 5),
            "photo_exif_timestamp": s_date2.isoformat() + "T14:00:00",
            "workflow_status": "FLAGGED",
            "seed_type": "DOUBLE_FUNDING_PAIR_B"
        })
        work_seq += 1

    # PHASE 3: Seed Cost / Overpricing Anomalies (~25 projects with Z-score > 2.2)
    print(" -> Seeding statistical cost outliers (z-score > 2.2)...")
    for _ in range(25):
        const = random.choice(CONSTITUENCIES)
        cat = random.choice(CATEGORIES)
        loc1 = random.choice(LOCALITIES)
        loc2 = random.choice(LOCALITIES)
        num = random.randint(1, 30)
        title = random.choice(cat["templates"]).format(loc1=loc1, loc2=loc2, num=num)

        z_multiplier = random.uniform(2.3, 3.5)
        inflated_cost = round(cat["median_cost"] + (cat["std_cost"] * z_multiplier), 2)

        p_lat = round(const["lat"] + random.uniform(-0.05, 0.05), 5)
        p_lng = round(const["lng"] + random.uniform(-0.05, 0.05), 5)

        s_date = base_date + datetime.timedelta(days=random.randint(20, 280))
        c_date = s_date + datetime.timedelta(days=random.randint(150, 300))

        firm = random.choice(all_contractors)

        img_name = f"project_{work_seq:04d}.jpg"
        img_path = os.path.join(PHOTOS_DIR, img_name)
        generate_exif_image(img_path, p_lat, p_lng, datetime.datetime.combine(s_date, datetime.time(9, 30)), pattern_seed=work_seq)

        records.append({
            "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
            "work_code": f"{const['id']}-W{work_seq:04d}",
            "title": title,
            "category": cat["category"],
            "constituency_id": const["id"],
            "constituency_name": const["name"],
            "state": const["state"],
            "district": const["district"],
            "mp_name": const["mp"],
            "sanctioned_cost_lakhs": inflated_cost,
            "expenditure_lakhs": round(inflated_cost * 0.94, 2),
            "latitude": p_lat,
            "longitude": p_lng,
            "sanction_date": s_date.isoformat(),
            "target_completion_date": c_date.isoformat(),
            "contractor_name": firm["name"],
            "contractor_pan": firm["pan"],
            "contractor_gstin": firm["gstin"],
            "contractor_phone": firm["phone"],
            "contractor_address": firm["address"],
            "site_photo_url": f"/site_photos/{img_name}",
            "photo_exif_lat": p_lat + 0.0001,
            "photo_exif_lng": p_lng + 0.0001,
            "photo_exif_timestamp": s_date.isoformat() + "T09:30:00",
            "workflow_status": "FLAGGED",
            "seed_type": "COST_OUTLIER"
        })
        work_seq += 1

    # PHASE 4: Seed Photo Anomalies & Geo-Tag Mismatches (~30 projects)
    print(" -> Seeding EXIF geo-mismatch (>500m), stripped metadata, and ghost photo reuse...")
    for p_idx in range(30):
        const = random.choice(CONSTITUENCIES)
        cat = random.choice(CATEGORIES)
        loc1 = random.choice(LOCALITIES)
        loc2 = random.choice(LOCALITIES)
        num = random.randint(1, 30)
        title = random.choice(cat["templates"]).format(loc1=loc1, loc2=loc2, num=num)
        cost = round(random.gauss(cat["median_cost"], cat["std_cost"] * 0.6), 2)
        cost = max(cat["min_cost"], min(cost, cat["max_cost"]))

        claimed_lat = round(const["lat"] + random.uniform(-0.04, 0.04), 5)
        claimed_lng = round(const["lng"] + random.uniform(-0.04, 0.04), 5)

        s_date = base_date + datetime.timedelta(days=random.randint(30, 260))
        firm = random.choice(all_contractors)

        anomaly_type = p_idx % 3
        if anomaly_type == 0:
            mismatch_km = random.uniform(1.2, 8.5)
            exif_lat = round(claimed_lat + (mismatch_km / 111.0), 5)
            exif_lng = round(claimed_lng + (mismatch_km / (111.0 * math.cos(math.radians(claimed_lat)))), 5)
            
            img_name = f"project_{work_seq:04d}.jpg"
            img_path = os.path.join(PHOTOS_DIR, img_name)
            generate_exif_image(img_path, exif_lat, exif_lng, datetime.datetime.combine(s_date, datetime.time(12, 15)), pattern_seed=work_seq)

            records.append({
                "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
                "work_code": f"{const['id']}-W{work_seq:04d}",
                "title": title,
                "category": cat["category"],
                "constituency_id": const["id"],
                "constituency_name": const["name"],
                "state": const["state"],
                "district": const["district"],
                "mp_name": const["mp"],
                "sanctioned_cost_lakhs": cost,
                "expenditure_lakhs": round(cost * 0.75, 2),
                "latitude": claimed_lat,
                "longitude": claimed_lng,
                "sanction_date": s_date.isoformat(),
                "target_completion_date": (s_date + datetime.timedelta(days=150)).isoformat(),
                "contractor_name": firm["name"],
                "contractor_pan": firm["pan"],
                "contractor_gstin": firm["gstin"],
                "contractor_phone": firm["phone"],
                "contractor_address": firm["address"],
                "site_photo_url": f"/site_photos/{img_name}",
                "photo_exif_lat": exif_lat,
                "photo_exif_lng": exif_lng,
                "photo_exif_timestamp": s_date.isoformat() + "T12:15:00",
                "workflow_status": "FLAGGED",
                "seed_type": "GEOTAG_LOCATION_MISMATCH"
            })
        elif anomaly_type == 1:
            img_name = f"project_{work_seq:04d}.jpg"
            img_path = os.path.join(PHOTOS_DIR, img_name)
            generate_exif_image(img_path, claimed_lat, claimed_lng, datetime.datetime.now(), is_stripped=True, pattern_seed=work_seq)

            records.append({
                "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
                "work_code": f"{const['id']}-W{work_seq:04d}",
                "title": title,
                "category": cat["category"],
                "constituency_id": const["id"],
                "constituency_name": const["name"],
                "state": const["state"],
                "district": const["district"],
                "mp_name": const["mp"],
                "sanctioned_cost_lakhs": cost,
                "expenditure_lakhs": round(cost * 0.80, 2),
                "latitude": claimed_lat,
                "longitude": claimed_lng,
                "sanction_date": s_date.isoformat(),
                "target_completion_date": (s_date + datetime.timedelta(days=150)).isoformat(),
                "contractor_name": firm["name"],
                "contractor_pan": firm["pan"],
                "contractor_gstin": firm["gstin"],
                "contractor_phone": firm["phone"],
                "contractor_address": firm["address"],
                "site_photo_url": f"/site_photos/{img_name}",
                "photo_exif_lat": None,
                "photo_exif_lng": None,
                "photo_exif_timestamp": None,
                "workflow_status": "FLAGGED",
                "seed_type": "MISSING_GEOTAG_EXIF"
            })
        else:
            shared_photo = random.choice(ghost_image_files)
            records.append({
                "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
                "work_code": f"{const['id']}-W{work_seq:04d}",
                "title": title,
                "category": cat["category"],
                "constituency_id": const["id"],
                "constituency_name": const["name"],
                "state": const["state"],
                "district": const["district"],
                "mp_name": const["mp"],
                "sanctioned_cost_lakhs": cost,
                "expenditure_lakhs": round(cost * 0.90, 2),
                "latitude": claimed_lat,
                "longitude": claimed_lng,
                "sanction_date": s_date.isoformat(),
                "target_completion_date": (s_date + datetime.timedelta(days=150)).isoformat(),
                "contractor_name": firm["name"],
                "contractor_pan": firm["pan"],
                "contractor_gstin": firm["gstin"],
                "contractor_phone": firm["phone"],
                "contractor_address": firm["address"],
                "site_photo_url": shared_photo,
                "photo_exif_lat": 25.3176,
                "photo_exif_lng": 82.9739,
                "photo_exif_timestamp": "2024-07-15T11:30:00",
                "workflow_status": "FLAGGED",
                "seed_type": "GHOST_PHOTO_REUSE"
            })
        work_seq += 1

    # PHASE 5: Fill remainder with Normal, Clean, Compliant Projects
    remaining_count = total_records - len(records)
    print(f" -> Generating {remaining_count} normal compliant MPLAD projects...")
    for _ in range(remaining_count):
        const = random.choice(CONSTITUENCIES)
        cat = random.choice(CATEGORIES)
        loc1 = random.choice(LOCALITIES)
        loc2 = random.choice(LOCALITIES)
        num = random.randint(1, 50)
        title = random.choice(cat["templates"]).format(loc1=loc1, loc2=loc2, num=num)

        cost = round(random.gauss(cat["median_cost"], cat["std_cost"] * 0.7), 2)
        cost = max(cat["min_cost"], min(cost, cat["max_cost"]))

        p_lat = round(const["lat"] + random.uniform(-0.06, 0.06), 5)
        p_lng = round(const["lng"] + random.uniform(-0.06, 0.06), 5)

        s_date = base_date + datetime.timedelta(days=random.randint(10, 320))
        c_date = s_date + datetime.timedelta(days=random.randint(100, 240))

        firm = random.choice(INDEPENDENT_CONTRACTORS)

        img_name = f"project_{work_seq:04d}.jpg"
        img_path = os.path.join(PHOTOS_DIR, img_name)
        drift_lat = p_lat + random.uniform(-0.0003, 0.0003)
        drift_lng = p_lng + random.uniform(-0.0003, 0.0003)
        generate_exif_image(img_path, drift_lat, drift_lng, datetime.datetime.combine(s_date + datetime.timedelta(days=45), datetime.time(15, 20)), pattern_seed=work_seq)

        statuses = ["CLEARED", "CLEARED", "UNDER_REVIEW", "CLEARED"]
        status = random.choice(statuses)

        records.append({
            "id": f"MPLADS-2024-25-{const['id']}-{work_seq:04d}",
            "work_code": f"{const['id']}-W{work_seq:04d}",
            "title": title,
            "category": cat["category"],
            "constituency_id": const["id"],
            "constituency_name": const["name"],
            "state": const["state"],
            "district": const["district"],
            "mp_name": const["mp"],
            "sanctioned_cost_lakhs": cost,
            "expenditure_lakhs": round(cost * random.uniform(0.5, 0.95), 2),
            "latitude": p_lat,
            "longitude": p_lng,
            "sanction_date": s_date.isoformat(),
            "target_completion_date": c_date.isoformat(),
            "contractor_name": firm["name"],
            "contractor_pan": firm["pan"],
            "contractor_gstin": firm["gstin"],
            "contractor_phone": firm["phone"],
            "contractor_address": firm["address"],
            "site_photo_url": f"/site_photos/{img_name}",
            "photo_exif_lat": round(drift_lat, 5),
            "photo_exif_lng": round(drift_lng, 5),
            "photo_exif_timestamp": (s_date + datetime.timedelta(days=45)).isoformat() + "T15:20:00",
            "workflow_status": status,
            "seed_type": "COMPLIANT_CLEAN"
        })
        work_seq += 1

    random.shuffle(records)

    json_path = os.path.join(DATA_DIR, 'projects.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2)
    print(f"[OK] Saved {len(records)} projects to {json_path}")

    frontend_data_dir = os.path.join(os.path.dirname(BASE_DIR), 'src', 'data')
    os.makedirs(frontend_data_dir, exist_ok=True)
    frontend_json_path = os.path.join(frontend_data_dir, 'generatedProjects.json')
    with open(frontend_json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2)
    print(f"[OK] Synced frontend fallback data to {frontend_json_path}")

    sqlite_path = os.path.join(DATA_DIR, 'satya_lads.db')
    init_sqlite_db(sqlite_path, records)
    print(f"[OK] Initialized SQLite database at {sqlite_path}")

    return records

def init_sqlite_db(db_path: str, records: List[Dict[str, Any]]):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS projects")
    cur.execute("""
        CREATE TABLE projects (
            id TEXT PRIMARY KEY,
            work_code TEXT,
            title TEXT,
            category TEXT,
            constituency_id TEXT,
            constituency_name TEXT,
            state TEXT,
            district TEXT,
            mp_name TEXT,
            sanctioned_cost_lakhs REAL,
            expenditure_lakhs REAL,
            latitude REAL,
            longitude REAL,
            sanction_date TEXT,
            target_completion_date TEXT,
            contractor_name TEXT,
            contractor_pan TEXT,
            contractor_gstin TEXT,
            contractor_phone TEXT,
            contractor_address TEXT,
            site_photo_url TEXT,
            photo_exif_lat REAL,
            photo_exif_lng REAL,
            photo_exif_timestamp TEXT,
            workflow_status TEXT,
            seed_type TEXT,
            risk_score REAL DEFAULT 0.0,
            risk_band TEXT DEFAULT 'LOW',
            flags_json TEXT DEFAULT '[]'
        )
    """)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_cat ON projects(category)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_state ON projects(state)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_pan ON projects(contractor_pan)")

    for r in records:
        cur.execute("""
            INSERT INTO projects (
                id, work_code, title, category, constituency_id, constituency_name,
                state, district, mp_name, sanctioned_cost_lakhs, expenditure_lakhs,
                latitude, longitude, sanction_date, target_completion_date,
                contractor_name, contractor_pan, contractor_gstin, contractor_phone,
                contractor_address, site_photo_url, photo_exif_lat, photo_exif_lng,
                photo_exif_timestamp, workflow_status, seed_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            r["id"], r["work_code"], r["title"], r["category"], r["constituency_id"], r["constituency_name"],
            r["state"], r["district"], r["mp_name"], r["sanctioned_cost_lakhs"], r["expenditure_lakhs"],
            r["latitude"], r["longitude"], r["sanction_date"], r["target_completion_date"],
            r["contractor_name"], r["contractor_pan"], r["contractor_gstin"], r["contractor_phone"],
            r["contractor_address"], r["site_photo_url"], r["photo_exif_lat"], r["photo_exif_lng"],
            r["photo_exif_timestamp"], r["workflow_status"], r["seed_type"]
        ))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    generate_dataset(320)
