import sys

def check_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        line = line.strip()
        # Very simple tag detection
        if '<section' in line:
            stack.append(('section', i+1))
        if '<div' in line and '/>' not in line:
            stack.append(('div', i+1))
        if '</section>' in line:
            if stack and stack[-1][0] == 'section':
                stack.pop()
            else:
                print(f"Error: section closed at line {i+1} but not opened correctly")
        if '</div>' in line:
            if stack and stack[-1][0] == 'div':
                stack.pop()
            else:
                print(f"Error: div closed at line {i+1} but not opened correctly")
    
    if stack:
        print("Remaining stack:")
        for tag, line in stack:
            print(f"{tag} opened at line {line}")

if __name__ == "__main__":
    check_tags(sys.argv[1])
