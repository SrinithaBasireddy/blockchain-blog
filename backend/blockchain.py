import hashlib
import json
import time
from datetime import datetime


class Block:
    def __init__(self, index, data, previous_hash, difficulty=2):
        self.index = index
        self.timestamp = time.time()
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.difficulty = difficulty
        self.hash = self.mine_block()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self):
        target = "0" * self.difficulty
        while True:
            h = self.calculate_hash()
            if h[:self.difficulty] == target:
                return h
            self.nonce += 1

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "timestamp_readable": datetime.fromtimestamp(self.timestamp).strftime("%Y-%m-%d %H:%M:%S"),
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "nonce": self.nonce,
            "difficulty": self.difficulty
        }


class Blockchain:
    def __init__(self):
        self.difficulty = 2
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, {"title": "Genesis Block", "content": "The immutable origin of this chain.", "author": "System", "tags": []}, "0", self.difficulty)

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        block = Block(len(self.chain), data, self.get_latest_block().hash, self.difficulty)
        self.chain.append(block)
        return block

    def is_chain_valid(self):
        errors = []
        for i in range(1, len(self.chain)):
            cur, prev = self.chain[i], self.chain[i - 1]
            if cur.hash != cur.calculate_hash():
                errors.append(f"Block {i}: hash mismatch (data tampered).")
            if cur.previous_hash != prev.hash:
                errors.append(f"Block {i}: broken chain link.")
            if not cur.hash.startswith("0" * cur.difficulty):
                errors.append(f"Block {i}: invalid proof of work.")
        return {"valid": len(errors) == 0, "errors": errors, "chain_length": len(self.chain)}

    def get_chain(self):
        return [b.to_dict() for b in self.chain]

    def search_posts(self, query):
        q = query.lower()
        return [b.to_dict() for b in self.chain[1:] if
                q in b.data.get("title", "").lower() or
                q in b.data.get("content", "").lower() or
                q in b.data.get("author", "").lower() or
                any(q in t.lower() for t in b.data.get("tags", []))]
