from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain import Blockchain
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

try:
    from pymongo import MongoClient
    client = MongoClient(os.environ.get("MONGO_URI", "mongodb://localhost:27017/"), serverSelectionTimeoutMS=3000)
    client.server_info()
    db = client["blockchain_blog"]
    users_col = db["users"]
    mongo_available = True
    print("✅ MongoDB connected")
except Exception as e:
    mongo_available = False
    in_memory_users = {}
    print(f"⚠️  MongoDB not available. Running in-memory mode.")

blockchain = Blockchain()

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "mongo": mongo_available, "blocks": len(blockchain.chain)})

@app.route("/api/register", methods=["POST"])
def register():
    d = request.json
    u, p = d.get("username","").strip(), d.get("password","").strip()
    if not u or not p: return jsonify({"error": "All fields required"}), 400
    if mongo_available:
        if users_col.find_one({"username": u}): return jsonify({"error": "Username taken"}), 409
        users_col.insert_one({"username": u, "password": p})
    else:
        if u in in_memory_users: return jsonify({"error": "Username taken"}), 409
        in_memory_users[u] = p
    return jsonify({"message": "Registered"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    d = request.json
    u, p = d.get("username","").strip(), d.get("password","").strip()
    if mongo_available:
        if not users_col.find_one({"username": u, "password": p}):
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        if in_memory_users.get(u) != p:
            return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "OK", "token": f"tok-{u}-{int(datetime.utcnow().timestamp())}", "username": u})

@app.route("/api/posts")
def get_posts():
    chain = blockchain.get_chain()
    return jsonify({"posts": chain[1:], "total": len(chain) - 1})

@app.route("/api/posts", methods=["POST"])
def create_post():
    d = request.json
    title = d.get("title","").strip()
    content = d.get("content","").strip()
    if not title or not content: return jsonify({"error": "Title and content required"}), 400
    block = blockchain.add_block({"title": title, "content": content,
                                   "author": d.get("author","Anonymous"),
                                   "tags": d.get("tags",[]),
                                   "created_at": datetime.utcnow().isoformat()})
    return jsonify({"message": "Block mined", "block": block.to_dict()}), 201

@app.route("/api/posts/<int:idx>")
def get_post(idx):
    chain = blockchain.get_chain()
    if idx < 1 or idx >= len(chain): return jsonify({"error": "Not found"}), 404
    return jsonify(chain[idx])

@app.route("/api/search")
def search():
    q = request.args.get("q","")
    return jsonify({"results": blockchain.search_posts(q) if q else [], "count": 0})

@app.route("/api/blockchain")
def get_blockchain():
    return jsonify({"chain": blockchain.get_chain(), "length": len(blockchain.chain)})

@app.route("/api/blockchain/verify")
def verify():
    return jsonify(blockchain.is_chain_valid())

# ── Single block verify ──────────────────────────────────────────────────────
@app.route("/api/blockchain/verify/<int:idx>")
def verify_block(idx):
    chain = blockchain.chain
    if idx < 0 or idx >= len(chain):
        return jsonify({"error": "Block not found"}), 404

    block = chain[idx]
    errors = []

    recalculated = block.calculate_hash()
    hash_valid = block.hash == recalculated
    pow_valid = block.hash.startswith("0" * block.difficulty)
    link_valid = True
    if idx > 0:
        link_valid = block.previous_hash == chain[idx - 1].hash

    if not hash_valid:
        errors.append("Hash mismatch — block data may have been tampered.")
    if not pow_valid:
        errors.append(f"Proof of Work invalid — hash does not meet difficulty target.")
    if not link_valid:
        errors.append("Chain link broken — previous_hash mismatch.")

    return jsonify({
        "block_index": idx,
        "valid": len(errors) == 0,
        "hash_valid": hash_valid,
        "pow_valid": pow_valid,
        "link_valid": link_valid,
        "errors": errors,
        "block": block.to_dict()
    })

@app.route("/api/blockchain/stats")
def stats():
    chain = blockchain.get_chain()
    posts = chain[1:]
    tags = {}
    for p in posts:
        for t in p["data"].get("tags",[]):
            tags[t] = tags.get(t,0)+1
    return jsonify({
        "total_blocks": len(chain), "total_posts": len(posts),
        "unique_authors": len(set(p["data"].get("author","") for p in posts)),
        "difficulty": blockchain.difficulty,
        "top_tags": sorted(tags.items(), key=lambda x:-x[1])[:5],
        "latest_hash": chain[-1]["hash"] if chain else None
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)  # ✅
