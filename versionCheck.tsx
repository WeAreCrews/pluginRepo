/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { PluginNative } from "@utils/types";
import { Button } from "@webpack/common";
const Native = VencordNative.pluginHelpers.PluginsRepo as PluginNative<typeof import("./native")>;

export const VERSION = "1.0.0";

async function getVersion() {
    const repoVersion = await (await fetch("https://raw.githubusercontent.com/ScattrdBlade/PluginsRepo/main/versionCheck.tsx", { cache: "no-cache" })).text();
    const repoVersionMatch = repoVersion.match(/export const VERSION = "(.+)";/);
    if (!repoVersionMatch) return;
    const [_, version] = repoVersionMatch;
    const [major, minor, patch] = version.split(".").map(m => parseInt(m));
    if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) return false;
    const [currMajor, currMinor, currPatch] = VERSION.split(".").map(m => parseInt(m));
    if (major > currMajor || minor > currMinor || patch > currPatch) return version;
    return false;
}

export async function checkUpdate() {
    const updateVer = await getVersion();
    if (!updateVer) return;

    showNotification({
        title: `Update available for Plugin Repo: ${updateVer}`,
        body: "Click here to update to the latest version.",
        permanent: true,
        noPersist: false,
        onClick: Native.updatePluginRepo
    });
}

export function updateButton() {
    return (<Button onClick={() => checkUpdate()}>Check for update!</Button>);
}
