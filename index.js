
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

        for (let line of input.split("\n")) {

            if (line.startsWith("```")) {
                isCodeBlock = !isCodeBlock;
            }

            if (isCodeBlock) {
                continue;
            }

            if (line.startsWith("#")) {
                const match = line.match(/(#+)\s*(.*?)#*\s*$/);
                const level = match[1].length;
                if (isNaN(topLevel)) {
                    topLevel = level;
                }

                if (level - topLevel >= this.levelsToShow) {
                    continue;
                }

                const title = match[2].trim();
                const link = title.toLocaleLowerCase()
                    .replace(/\s/g, "-")
                    .replace(/[^A-Za-z0-9-]/g, "");
                const menu = `${"  ".repeat(level - topLevel)}- [${title}](#${link})`;
                menus.push(menu);
            }
        }

        this.outputArea.value = menus.join("\n");
    }
}
