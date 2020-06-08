
class MarkdownToc {

    constructor () {
        this.inputArea = document.getElementById("input-area");
        this.outputArea = document.getElementById("output-area");
        this.levelUpButton = document.getElementById("level-up");
        this.levelUpButton.addEventListener("click", this.changeLevel.bind(this, +1));
        this.levelDownButton = document.getElementById("level-down");
        this.levelDownButton.addEventListener("click", this.changeLevel.bind(this, -1));
        this.levelsToShowElement = document.getElementById("levels-to-show");
        this.levelsToShow = 2;

        this.inputArea.addEventListener("input", this.process.bind(this));
        this.process();
    }

    changeLevel(delta) {
        this.levelsToShow += delta;
        if (this.levelsToShow < 1) {
            this.levelsToShow = 1;
        } else if (this.levelsToShow > 10) {
            this.levelsToShow = 10;
        } else if (typeof this.levelsToShow !== "number") {
            this.levelsToShow = 2;
        }
        this.levelsToShowElement.setAttribute("value", this.levelsToShow);
        this.process();
    }

    process() {
        const input = this.inputArea.value;
        const menus = ["# Table of contents", ""];
        let isCodeBlock = false;
        let topLevel = NaN;
        let previous = null;

        for (let line of input.split("\n")) {

            const trimmed = line.trim();
    
            if (trimmed.startsWith("```")) {
                isCodeBlock = !isCodeBlock;
            }

            if (isCodeBlock) {
                continue;
            }

            let level = NaN;
            let title = null;

            if (trimmed.startsWith("#")) {
                const match = trimmed.match(/(#+)\s*(.*?)#*\s*$/);
                level = match[1].length;
                title = match[2].trim();
            } else if (previous != null && previous.length > 0 && trimmed.length > 0) {
                if (trimmed.match(/[^=]/g) == null) {
                    level = 1;
                    title = previous;
                } else if (trimmed.match(/[^-]/g) == null && previous.match(/[^-]/g) != null) {
                    level = 2;
                    title = previous;
                }
            }

            if (level != NaN && title != null) {
                if (isNaN(topLevel)) {
                    topLevel = level;
                }

                if (level - topLevel >= this.levelsToShow) {
                    continue;
                }

                const link = title.toLocaleLowerCase()
                    .replace(/\s/g, "-")
                    .replace(/[^A-Za-z0-9-]/g, "");
                const menu = `${"  ".repeat(level - topLevel)}- [${title}](#${link})`;
                menus.push(menu);

                previous = null;
            } else {
                previous = trimmed;
            }
        }

        this.outputArea.value = menus.join("\n");
    }
}
