/*
 * Copyright 2026 NAVER Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.navercorp.pinpoint.test.plugin.maven;

import java.util.List;

/**
 * @author emeroad
 */
public interface DependencyResolverFactory {

    // org.eclipse.aether.ConfigurationProperties.CONNECT_TIMEOUT, in milliseconds
    String CONNECT_TIMEOUT = "aether.connector.connectTimeout";
    // org.eclipse.aether.ConfigurationProperties.REQUEST_TIMEOUT, in milliseconds
    String REQUEST_TIMEOUT = "aether.connector.requestTimeout";

    DependencyResolver get(List<String> repositoryUrls);

    DependencyResolver get(String... repositoryUrls);
}
